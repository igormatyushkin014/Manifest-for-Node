import express from "express";
import { AnyResponse } from "./any-response";
import { BaseResponse, isBaseResponse } from "./base-response";

export interface AsyncCustomResponse extends BaseResponse {
	asyncHandler: (
		request: express.Request,
		response: express.Response,
		callback: (response?: AnyResponse) => void
	) => void
}

export const isAsyncCustomResponse = (obj: any): obj is AsyncCustomResponse => {
	if (isBaseResponse(obj)) {
		const requirements = [
			"asyncHandler" in obj && typeof obj["asyncHandler"] === "function"
		];
		return !requirements.includes(false);
	} else {
		return false;
	}
}