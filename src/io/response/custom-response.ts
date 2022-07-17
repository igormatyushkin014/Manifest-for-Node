import express from "express";
import { AnyResponse } from "./any-response";
import { BaseResponse, isBaseResponse } from "./base-response";

export interface CustomResponse extends BaseResponse {
	handler: (
		request: express.Request,
		response: express.Response
	) => AnyResponse | undefined
}

export const isCustomResponse = (obj: any): obj is CustomResponse => {
	if (isBaseResponse(obj)) {
		const requirements = [
			"handler" in obj && typeof obj["handler"] === "function"
		];
		return !requirements.includes(false);
	} else {
		return false;
	}
}