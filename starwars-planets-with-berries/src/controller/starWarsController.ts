import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { IStarWarsPlanet } from "../application/IStarWarsPlanet";
import { errorResponseManager, responseOkGenerator } from "../utils/helpers";

export class StarWarsController {
  constructor(private readonly starWarsService: IStarWarsPlanet) {}
  async getPlanets(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    try {
      console.log("Controller started");
      console.log(event);
      const id: number = Number(event.pathParameters!.id!);
      const resultFromService = await this.starWarsService.fetchPlanet(id);
      return responseOkGenerator(resultFromService);
    } catch (error) {
      console.error("Error in getPlanets:", error);
      return errorResponseManager(error);
    }
  }
}
