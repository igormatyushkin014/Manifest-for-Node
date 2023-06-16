import express from "express";
import http from "http";
import https from "https";
import cors from "cors";
import { RequestHandler } from "./io/request/request-handler";
import { getDefaultManifest, Manifest } from "./manifest";
import { InputOutput } from "./integration/express/input-output";
import { AnyResponse } from "./io/response/any-response";
import { isCustomResponse } from "./io/response/custom-response";
import { isAsyncCustomResponse } from "./io/response/async-custom-response";
import { isTextResponse } from "./io/response/text-response";
import { isJsonResponse } from "./io/response/json-response";
import { isPageResponse } from "./io/response/page-response";
import { isRedirectResponse } from "./io/response/redirect-response";

export class App {

	public static create(
		manifest: Manifest | null = null
	): App {
		return new App(
			manifest ? manifest : getDefaultManifest()
		);
	}

	public readonly expressInstance: express.Express;

	private readonly router: express.Router;

	private readonly requestHandlers: RequestHandler[];

	private server: http.Server | https.Server;

	private constructor(
		private readonly manifest: Manifest
	) {
		this.expressInstance = express();
		this.router = express.Router();
		this.requestHandlers = [];
		this.server = manifest.server.secure
			? https.createServer(this.expressInstance)
			: http.createServer(this.expressInstance);

		this.preSetup();

		if (!manifest.server.corsBlocked) {
			this.expressInstance.use(
				cors()
			);
		}

		this.addStaticLocations();
		this.insertRequestHandlers();
		this.mountRoutes();
		this.setupViewEngine();
	}

	private addStaticLocations() {
		this.manifest.server.staticLocations?.forEach((location) => {
			this.expressInstance.use(
				location.alias,
				express.static(
					location.realPath
				)
			);
		});
	}

	private insertRequestHandlers() {
		this.expressInstance.use((request, response, next) => {
			if (this.manifest.api.requestHandlers) {
				for (let handler of this.manifest.api.requestHandlers) {
					handler(request);
				}
			}

			next();
		});
	}

	private preSetup = () => {
		if (this.manifest.server.preSetup) {
			this.manifest.server.preSetup(
				this.expressInstance,
				this.server
			);
		}
	}

	private sendResponse = (
		response: AnyResponse,
		inputOutput: InputOutput,
		ignoreDelay: boolean
	) => {
		// Wait for delay if needed

		if (!ignoreDelay && response.delay) {
			let delay = response.delay instanceof Function
				? response.delay() as number
				: response.delay;

			setTimeout(
				() => {
					this.sendResponse(
						response,
						inputOutput,
						true
					);
				},
				delay
			);
			return;
		}

		// Set response headers

		if (response.headers) {
			Object.keys(response.headers).forEach(headerName => {
				inputOutput.response.setHeader(
					headerName,
					response.headers![headerName]
				);
			});
		}

		// Set response status

		if (response.status) {
			inputOutput.response.status(
				response.status
			);
		}

		// Check response type and handle it appropriately

		if (isCustomResponse(response)) {
			let result = response.handler(
				inputOutput.request,
				inputOutput.response
			);

			if (result) {
				this.sendResponse(
					result,
					inputOutput,
					true
				);
			}
		} else if (isAsyncCustomResponse(response)) {
			response.asyncHandler(
				inputOutput.request,
				inputOutput.response,
				(result) => {
					if (result) {
						this.sendResponse(
							result,
							inputOutput,
							true
						);
					}
				}
			);
		} else if (isTextResponse(response)) {
			inputOutput.response.send(
				response.text
			);
		} else if (isJsonResponse(response)) {
			inputOutput.response.json(
				response.json
			);
		} else if (isPageResponse(response)) {
			inputOutput.response.render(
				response.path,
				response.data
			);
		} else if (isRedirectResponse(response)) {
			inputOutput.response.redirect(
				response.redirectTo
			);
		}
	}

	private mountRoutes() {
		const emptyHandler = (request: express.Request, response: any, next: any) => {
			next();
		};

		this.manifest.api.routes.forEach(route => {
			if (route.methods.get) {
				let methodHandler = route.methods.get;
				this.router.get(
					route.url,
					route.corsBlocked ? emptyHandler : cors(),
					(request, response) => {
						this.sendResponse(
							route.methods.get!,
							new InputOutput(
								request,
								response
							),
							!methodHandler.delay
						);
					}
				);
			}

			if (route.methods.post) {
				let methodHandler = route.methods.post;
				this.router.post(
					route.url,
					route.corsBlocked ? emptyHandler : cors(),
					(request, response) => {
						this.sendResponse(
							methodHandler,
							new InputOutput(
								request,
								response
							),
							!methodHandler.delay
						);
					}
				);
			}

			if (route.methods.put) {
				let methodHandler = route.methods.put;
				this.router.put(
					route.url,
					route.corsBlocked ? emptyHandler : cors(),
					(request, response) => {
						this.sendResponse(
							methodHandler,
							new InputOutput(
								request,
								response
							),
							!methodHandler.delay
						);
					}
				);
			}

			if (route.methods.delete) {
				let methodHandler = route.methods.delete;
				this.router.delete(
					route.url,
					route.corsBlocked ? emptyHandler : cors(),
					(request, response) => {
						this.sendResponse(
							methodHandler,
							new InputOutput(
								request,
								response
							),
							!methodHandler.delay
						);
					}
				);
			}
		});

		this.expressInstance.use(
			express.json()
		);
		this.expressInstance.use(
			express.urlencoded({
				extended: true
			})
		);
		this.expressInstance.use(
			`/`,
			this.router
		);
	}

	private setupViewEngine = () => {
		if (this.manifest.viewEngines) {
			switch (this.manifest.viewEngines.current) {
				case "handlebars": {
					var expressHbs = require("express-hbs");
					this.expressInstance.engine(
						"hbs",
						expressHbs.express4({
							partialsDir: this.manifest.viewEngines.partialsDirectory
						})
					);

					this.expressInstance.set(
						"view engine",
						"hbs"
					);
					break;
				}
				case "none": {
					break;
				}
			}
		}
	}

	public start(
		callback?: (port: number) => void
	): this {
		let { port } = this.manifest.server;
		this.server.listen(
			port,
			() => {
				if (callback) {
					callback(
						port
					);
				}
			}
		);
		return this;
	}

	public getServer(): http.Server | https.Server {
		return this.server;
	}
}
