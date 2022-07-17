import { BaseResponse, isBaseResponse } from "./base-response";

export interface JsonResponse extends BaseResponse {
	json?: {[id: string]: any} | []
}

export const isJsonResponse = (obj: any): obj is JsonResponse => {
	if (isBaseResponse(obj)) {
		const requirements = [
			"json" in obj && typeof obj["json"] === "object"
		];
		return !requirements.includes(false);
	} else {
		return false;
	}
}