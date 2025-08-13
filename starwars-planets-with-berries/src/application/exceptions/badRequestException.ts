import { BAD_REQUEST_EXCEPTION_MESSAGE } from "../../utils/constants";

export class BadRequestException extends Error {
  constructor(message?: string) {
    super(message || BAD_REQUEST_EXCEPTION_MESSAGE);
  }
}
