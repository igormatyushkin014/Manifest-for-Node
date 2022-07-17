import { BaseResponse, isBaseResponse } from "./base-response";

export interface TextResponse extends BaseResponse {
	text: string
}

export const isTextResponse = (obj: any): obj is TextResponse => {
	if (isBaseResponse(obj)) {
		const requirements = [
			"text" in obj && typeof obj["text"] === "string"
		];
		return !requirements.includes(false);
	} else {
		return false;
	}
}