import axios from "axios";
import { InternalErrorException } from "../../application/exceptions/internalErrorException";
import { IHttpClient } from "./IHttpClient";
import { NotFoundException } from "../../application/exceptions/notFoundException";

export class AxiosClient implements IHttpClient {
  async get<T>(url: string): Promise<T> {
    try {
      const dataFromApi = await axios.get<T>(url);
      return dataFromApi.data;
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404)
        throw new NotFoundException(error.message);
      throw new InternalErrorException(error.message);
    }
  }
}
