import { Logger } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger("RequestLogger");
    const { hostname, url, ip } = req;
    logger.log(`Request: From ${ip}\t===>\t${hostname}${url}`);
    next();
}
