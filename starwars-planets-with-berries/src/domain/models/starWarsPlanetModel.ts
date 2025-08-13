export interface StarWarsPlanetModel {
  id: number;
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  typicalFood: {
    name: string;
    growth_time: string;
    smoothness: string;
    size: number;
  };
}
