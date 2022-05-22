import { AnyResponse } from "./io/response/any-response";

export type Route = {
	url: string,
	corsBlocked?: boolean,
	methods: {
		get?: AnyResponse,
		post?: AnyResponse,
		put?: AnyResponse,
		delete?: AnyResponse
	}
};
