import { RequestHandler } from "./io/request/request-handler";
import { Route } from "./route";
import express from "express";
import http from "http";
import https from "https";

export type Manifest = {
	readonly server: {
		readonly port: number,
		readonly secure: boolean,
		readonly corsEnabled: boolean,
		staticLocations?: {
			alias: string,
			realPath: string
		}[],
		readonly preSetup?: (
			expressInstance: express.Express,
			server: http.Server | https.Server
		) => void
	},
	readonly api: {
		readonly routes: Route[],
		readonly requestHandlers?: RequestHandler[]
	},
	readonly viewEngines?: {
		current: "handlebars" | "none",
		partialsDirectory: string
	},
	readonly blacklist?: {
		ip: string[]
	}
};

export const getDefaultManifest = (): Manifest => {
	return {
		server: {
			port: 3000,
			secure: false,
			corsEnabled: false
		},
		api: {
			routes: [
				{
					url: "*",
					methods: {
						get: {
							text: `
								<h1>
									Built with <a href="https://github.com/russo-programmisto/Manifest-for-Node">Manifest</a> framework 🎉
								</h1>
							`
						}
					}
				}
			]
		}
	};
};
