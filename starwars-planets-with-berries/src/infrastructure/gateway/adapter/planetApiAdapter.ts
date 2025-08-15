import { Planet } from "../../../domain/models/planet";
import { PlanetPort } from "../../../domain/ports/planetPort";
import { STAR_WARS_API_URL } from "../../../utils/constants";
import { logger } from "../../../utils/helpers";
import { PlanetDto } from "../dto/planet";
import { IHttpClient } from "../IHttpClient";

export class PlanetApiAdapter implements PlanetPort {
  constructor(private readonly httpClient: IHttpClient) {}

  async fetchPlanet(id: number): Promise<Planet> {
    logger.debug(`PlanetApiAdapter::fetchBerry, id ${id}`);
    const planetUrl = `${STAR_WARS_API_URL}${id}`;
    logger.debug(`planetApiAdapter::fetchBerry, url ${planetUrl}`);
    return await this.httpClient.get<PlanetDto>(planetUrl);
  }
}
