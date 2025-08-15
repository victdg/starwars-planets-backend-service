import { Berry } from "../../../domain/models/berry";
import { BerryPort } from "../../../domain/ports/berryPort";
import { BERRY_API_URL } from "../../../utils/constants";
import { logger } from "../../../utils/helpers";
import { BerryDto } from "../dto/berry";
import { IHttpClient } from "../IHttpClient";

export class BerryApiAdapter implements BerryPort {
  constructor(private readonly httpClient: IHttpClient) {}

  async fetchBerry(id: number): Promise<Berry> {
    logger.debug(`BerryApiAdapter::fetchBerry, id ${id}`);
    const berryUrl = `${BERRY_API_URL}${id}`;
    return await this.httpClient.get<BerryDto>(berryUrl);
  }
}
