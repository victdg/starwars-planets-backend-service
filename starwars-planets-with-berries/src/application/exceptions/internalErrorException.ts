import { INTERNAL_ERROR_EXCEPTION_MESSAGE } from "../../utils/constants";

export class InternalErrorException extends Error {
  constructor(message?: string) {
    super(message || INTERNAL_ERROR_EXCEPTION_MESSAGE);
  }
}
