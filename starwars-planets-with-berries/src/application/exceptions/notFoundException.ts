import { NOT_FOUND_EXCEPTION_MESSAGE } from "../../utils/constants";

export class NotFoundException extends Error {
  constructor(message: string) {
    super(NOT_FOUND_EXCEPTION_MESSAGE);
  }
}
