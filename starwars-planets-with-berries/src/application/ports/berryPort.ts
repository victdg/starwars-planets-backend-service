import { Berry } from "../models/Berry";

export interface BerryPort {
  fetchBerry(id: number): Promise<Berry>;
}
