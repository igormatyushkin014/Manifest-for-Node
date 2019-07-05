import {
	ViewData
} from "../../views";

export class PageResponse {

	constructor(
		public path: string,
		public data?: ViewData,
		public status?: number
	) {
	}
}

export const isPageResponse = (object: any): object is PageResponse => {
	return "path" in object;
};
