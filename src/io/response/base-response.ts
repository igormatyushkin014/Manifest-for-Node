export interface BaseResponse {
    headers?: {[id: string]: string},
    status?: number,
    delay?: number | (() => number)
}

export const isBaseResponse = (obj: any): obj is BaseResponse => {
    if (typeof obj === "object") {
        const requirements = [
            "headers" in obj ? typeof obj["headers"] === "object" : true,
            "status" in obj ? typeof obj["status"] === "number" : true,
            (() => {
                if ("delay" in obj) {
                    const valueType = typeof obj["delay"];
                    return valueType === "number" || valueType === "function";
                } else {
                    return true;
                }
            })()
        ];
        return !requirements.includes(false);
    } else {
        return false;
    }
}