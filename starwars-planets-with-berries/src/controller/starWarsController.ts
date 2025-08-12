import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { IStarWarsPlanet } from "../application/IStarWarsPlanet";

export class StarWarsController {
  constructor(private readonly starWarsService: IStarWarsPlanet) {}
  async getPlanets(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({
    //     message: "getPlanets",
    //   }),
    // };
    try {
      const id: number = Number(event.pathParameters!.id!);
      const resultFromService = await this.starWarsService.fetchPlanet(id);
      return {
        statusCode: 200,
        body: JSON.stringify(resultFromService),
      };
    } catch (error) {
      console.error("Error in getPlanets:", error);
      return {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({
          message: error.message || "Internal Server Error",
        }),
      };
    }
  }
}
