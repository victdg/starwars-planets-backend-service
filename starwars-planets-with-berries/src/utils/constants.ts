export const NOT_FOUND_EXCEPTION_MESSAGE = "Planet not found";
export const INTERNAL_ERROR_EXCEPTION_MESSAGE = "Something went wrong";
export const UNAVAILABLE_EXCEPTION_MESSAGE = "Service unavailable";
export const BAD_REQUEST_EXCEPTION_MESSAGE = "Bad request";

export const HISTORICAL_TABLE_NAME = process.env.HISTORICAL_TABLE_NAME;
export const CACHE_TABLE_NAME = process.env.CACHE_TABLE_NAME;
export const KING_TABLE_NAME = process.env.KING_TABLE_NAME;

export const REGION = process.env.REGION;

export const STAR_WARS_API_URL = "https://swapi.info/api/planets/";
export const BERRY_API_URL = "https://pokeapi.co/api/v2/berry/";

export const TTL_IN_SECONDS = 10;

export const SAVE_IN_CACHE = "save in cache";
export const FETCH_FROM_CACHE = "fetch from cache";

export const STAR_WARS_PLANET_HISTORICAL_TYPE =
  "StarWarsPlanetHistoricalFetchData";

export const HTTP_CODES = {
  OK: { statusCode: 200, message: "Ok" },
  BAD_REQUEST: { statusCode: 400, message: "Bad request" },
  NOT_FOUND: { statusCode: 404, message: "Planet not found" },
  INTERNAL_SERVER_ERROR: { statusCode: 500, message: "Something went wrong" },
  SERVICE_UNAVAILABLE: { statusCode: 503, message: "Service unavailable" },
};
