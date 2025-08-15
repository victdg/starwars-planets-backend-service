import { BadRequestException } from "../domain/exceptions/badRequestException";
import { NotFoundException } from "../domain/exceptions/notFoundException";
import { UnavailableServerException } from "../domain/exceptions/unavailableServerException";
import { HTTP_CODES, STAGE } from "./constants";

export const responseOkGenerator = (resultFromService?: any) => {
  return {
    statusCode: HTTP_CODES.OK.statusCode,
    body: JSON.stringify(resultFromService || HTTP_CODES.OK.message),
  };
};

export const responseErrorGenerator = (
  statusCode?: number,
  message?: string
) => {
  return {
    statusCode: statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR.statusCode,
    body: JSON.stringify({
      message: message || HTTP_CODES.INTERNAL_SERVER_ERROR.message,
    }),
  };
};

export const errorResponseManager = (error: any) => {
  switch (true) {
    case error instanceof NotFoundException:
      return responseErrorGenerator(
        HTTP_CODES.NOT_FOUND.statusCode,
        HTTP_CODES.NOT_FOUND.message
      );
      break;
    case error instanceof UnavailableServerException:
      return responseErrorGenerator(
        HTTP_CODES.SERVICE_UNAVAILABLE.statusCode,
        HTTP_CODES.SERVICE_UNAVAILABLE.message
      );
      break;
    case error instanceof BadRequestException:
      return responseErrorGenerator(
        HTTP_CODES.BAD_REQUEST.statusCode,
        HTTP_CODES.BAD_REQUEST.message
      );
      break;
    default:
      return responseErrorGenerator(
        HTTP_CODES.INTERNAL_SERVER_ERROR.statusCode,
        HTTP_CODES.INTERNAL_SERVER_ERROR.message
      );
  }
};

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

const shouldLog = (level: LogLevel) => {
  const levelOrder = ["DEBUG", "INFO", "WARN", "ERROR"];
  const minLevel = STAGE === "prod" ? "INFO" : "DEBUG"; // en prod no mostramos debug
  return levelOrder.indexOf(level) >= levelOrder.indexOf(minLevel);
};

export const logger = {
  debug: (msg: string, meta: Record<string, any> = {}) => {
    if (shouldLog("DEBUG")) console.debug(formatLog("DEBUG", msg, meta));
  },
  info: (msg: string, meta: Record<string, any> = {}) => {
    if (shouldLog("INFO")) console.info(formatLog("INFO", msg, meta));
  },
  warn: (msg: string, meta: Record<string, any> = {}) => {
    if (shouldLog("WARN")) console.warn(formatLog("WARN", msg, meta));
  },
  error: (msg: string, meta: Record<string, any> = {}) => {
    if (shouldLog("ERROR")) console.error(formatLog("ERROR", msg, meta));
  },
};

function formatLog(level: LogLevel, msg: string, meta?: Record<string, any>) {
  return JSON.stringify({
    time: new Date().toISOString(),
    stage: STAGE,
    level,
    message: msg,
    ...meta,
  });
}

export function requestGenerator(event: any) {
  return {
    body: event.body,
    headers: event.headers,
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
    httpMethod: event.httpMethod,
    isBase64Encoded: event.isBase64Encoded,
    requestContext: {
      accountId: event.requestContext.accountId,
      apiId: event.requestContext.apiId,
      httpMethod: event.requestContext.httpMethod,
      identity: event.requestContext.identity,
      path: event.requestContext.path,
      protocol: event.requestContext.protocol,
      requestId: event.requestContext.requestId,
    },
  };
}
