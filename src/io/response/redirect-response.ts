import { BaseResponse, isBaseResponse } from "./base-response";

export interface RedirectResponse extends BaseResponse {
	redirectTo: string
}

export const isRedirectResponse = (obj: any): obj is RedirectResponse => {
	if (isBaseResponse(obj)) {
		const requirements = [
			"redirectTo" in obj && typeof obj["redirectTo"] === "string"
		];
		return !requirements.includes(false);
	} else {
		return false;
	}
}