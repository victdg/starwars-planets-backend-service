import { ResponseHistoricalModel } from "../models/responseHistorical";

export interface ResponseHistoricalPort {
  save(responseHistoricalModel: ResponseHistoricalModel): Promise<void>;
}
