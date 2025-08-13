import { NotFoundException } from "../application/exceptions/notFoundException";
import { UnavailableServerException } from "../application/exceptions/unavailableServerException";
import { HTTP_CODES } from "./constants";

export const responseOkGenerator = (resultFromService: any) => {
  return {
    statusCode: HTTP_CODES.OK.statusCode,
    body: JSON.stringify(resultFromService),
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
        error.message || HTTP_CODES.NOT_FOUND.message
      );
      break;
    case error instanceof UnavailableServerException:
      return responseErrorGenerator(
        HTTP_CODES.SERVICE_UNAVAILABLE.statusCode,
        error.message || HTTP_CODES.SERVICE_UNAVAILABLE.message
      );
      break;
    default:
      return responseErrorGenerator(
        HTTP_CODES.INTERNAL_SERVER_ERROR.statusCode,
        error.message || HTTP_CODES.INTERNAL_SERVER_ERROR.message
      );
  }
};
