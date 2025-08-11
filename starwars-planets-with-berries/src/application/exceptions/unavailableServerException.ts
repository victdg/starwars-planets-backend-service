import { UNAVAILABLE_EXCEPTION_MESSAGE } from "../../utils/constants";

export class UnavailableServerException extends Error {
  constructor(message: string) {
    super(UNAVAILABLE_EXCEPTION_MESSAGE);
  }
}
