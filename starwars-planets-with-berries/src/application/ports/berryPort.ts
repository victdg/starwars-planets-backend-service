import { Berry } from "../models/berry";

export interface BerryPort {
  fetchBerry(id: number): Promise<Berry>;
}
