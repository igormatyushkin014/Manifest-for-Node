import {
	Manifest
} from "./configuration";

import {
	ViewEngine
} from "./view-engines";

type Store = {
	manifest: Manifest
};

var defaultManifest: Manifest = {
	server: {
		port: 3000,
		staticLocations: [],
		requestHandlers: [],
		routes: [
			{
				url: `*`,
				methods: {
					get: {
						text: `
							<h1>
								Built with Manifest library 🎉
							</h1>
						`
					}
				}
			}
		],
		viewEngines: {},
		currentViewEngine: ViewEngine.handlebars
	},
	socket: {
		host: "http://localhost",
		port: 12378,
		events: [
			{
				name: "message",
				handler: (data, socket) => {
				}
			}
		]
	},
	analytics: []
};

const store: Store = {
	manifest: defaultManifest
};

export const getDefaultManifest: () => Manifest = () => {
	return store.manifest;
}

export const setDefaultManifest: (manifest: Manifest) => void = (manifest) => {
	store.manifest = manifest;
};
