import axios from "axios";
import { InternalErrorException } from "../../domain/exceptions/internalErrorException";
import { IHttpClient } from "./IHttpClient";
import { NotFoundException } from "../../domain/exceptions/notFoundException";
import { logger } from "../../utils/helpers";

export class AxiosClient implements IHttpClient {
  async get<T>(url: string): Promise<T> {
    try {
      const dataFromApi = await axios.get<T>(url);
      return dataFromApi.data;
    } catch (error) {
      const errorDetails = {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        responseData: error.response?.data,
      };
      logger.error(`Axios error`, errorDetails);
      if (error.response?.status === 404)
        throw new NotFoundException(error.message);
      throw new InternalErrorException(error.message);
    }
  }
}
