import { Berry } from "../../../application/models/berry";
import { BerryPort } from "../../../application/ports/BerryPort";
import { BerryDto } from "../dto/berry";
import { IHttpClient } from "../IHttpClient";

export class BerryApiAdapter implements BerryPort {
  constructor(private readonly httpClient: IHttpClient) {}

  async fetchBerry(id: number): Promise<Berry> {
    const planetUrl = `STAR_WARS_API_URL${id}`;
    return await this.httpClient.get<BerryDto>(planetUrl);
  }
}
