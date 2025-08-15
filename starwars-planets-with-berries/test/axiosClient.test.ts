import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { AxiosClient } from "../src/infrastructure/gateway/axiosClient";
import { NotFoundException } from "../src/domain/exceptions/notFoundException";
import { InternalErrorException } from "../src/domain/exceptions/internalErrorException";

// Mock del módulo axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AxiosClient", () => {
  let axiosClient: AxiosClient;

  beforeEach(() => {
    axiosClient = new AxiosClient();
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("should return data on a successful request", async () => {
      const mockData = { id: 1, name: "Tatooine" };
      const mockUrl = "https://swapi.dev/api/planets/1";

      const mockResponse: AxiosResponse<any> = {
        data: mockData,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await axiosClient.get(mockUrl);

      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException on a 404 error", async () => {
      const mockUrl = "https://swapi.dev/api/planets/999";
      const errorMessage = "Request failed with status code 404";
      const error = {
        isAxiosError: true,
        message: errorMessage,
        response: {
          status: 404,
        },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(axiosClient.get(mockUrl)).rejects.toThrow(NotFoundException);
      await expect(axiosClient.get(mockUrl)).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl);
    });

    it("should throw InternalErrorException on a generic error", async () => {
      const mockUrl = "https://swapi.dev/api/planets/1";
      const errorMessage = "Network Error";
      const error = new Error(errorMessage);
      mockedAxios.get.mockRejectedValue(error);

      await expect(axiosClient.get(mockUrl)).rejects.toThrow(
        InternalErrorException
      );
      await expect(axiosClient.get(mockUrl)).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl);
    });

    it("should throw InternalErrorException on a non-404 HTTP error", async () => {
      const mockUrl = "https://swapi.dev/api/planets/1";
      const errorMessage = "Request failed with status code 500";
      const error = {
        isAxiosError: true,
        message: errorMessage,
        response: { status: 500 },
      };
      mockedAxios.get.mockRejectedValue(error);

      await expect(axiosClient.get(mockUrl)).rejects.toThrow(
        InternalErrorException
      );
      await expect(axiosClient.get(mockUrl)).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl);
    });
  });
});
