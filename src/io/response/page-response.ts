import { BaseResponse, isBaseResponse } from "./base-response";

export interface PageResponse extends BaseResponse {
	path: string,
	data?: any
}

export const isPageResponse = (obj: any): obj is PageResponse => {
	if (isBaseResponse(obj)) {
		const requirements = [
			"path" in obj && typeof obj["path"] === "string"
		];
		return !requirements.includes(false);
	} else {
		return false;
	}
};
