import { AnyResponse } from "./io/response/any-response";

export type Route = {
	url: string,
	corsEnabled?: boolean,
	methods: {
		get?: AnyResponse,
		post?: AnyResponse,
		put?: AnyResponse,
		delete?: AnyResponse
	}
};
