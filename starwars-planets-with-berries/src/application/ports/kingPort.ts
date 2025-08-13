import { KingModel } from "../models/king";

export interface KingPort {
  saveKing(king: KingModel): Promise<void>;
  // fetchKing(planetId: number): Promise<KingModel>;
}
