import { Planet } from "../../../application/models/planet";
import { PlanetPort } from "../../../application/ports/planetPort";
import { PlanetDto } from "../dto/planet";
import { IHttpClient } from "../IHttpClient";

export class PlanetApiAdapter implements PlanetPort {
  constructor(private readonly httpClient: IHttpClient) {}

  async fetchPlanet(id: number): Promise<Planet> {
    const planetUrl = `STAR_WARS_API_URL${id}`;
    return await this.httpClient.get<PlanetDto>(planetUrl);
  }
}
