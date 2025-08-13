import { BadRequestException } from "../application/exceptions/badRequestException";
import { NotFoundException } from "../application/exceptions/notFoundException";
import { UnavailableServerException } from "../application/exceptions/unavailableServerException";
import { HTTP_CODES } from "./constants";

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
  console.log("ErrorResponseManager::>>");
  switch (true) {
    case error instanceof NotFoundException:
      console.log("Not Found Exception");
      return responseErrorGenerator(
        HTTP_CODES.NOT_FOUND.statusCode,
        error.message || HTTP_CODES.NOT_FOUND.message
      );
      break;
    case error instanceof UnavailableServerException:
      return responseErrorGenerator(
        HTTP_CODES.SERVICE_UNAVAILABLE.statusCode,
        error.message || HTTP_CODES.SERVICE_UNAVAILABLE.message
      );
      break;
    case error instanceof BadRequestException:
      return responseErrorGenerator(
        HTTP_CODES.BAD_REQUEST.statusCode,
        error.message || HTTP_CODES.BAD_REQUEST.message
      );
      break;
    default:
      console.log("Default error");
      return responseErrorGenerator(
        HTTP_CODES.INTERNAL_SERVER_ERROR.statusCode,
        error.message || HTTP_CODES.INTERNAL_SERVER_ERROR.message
      );
  }
};
