import { AppError } from "./app-error.js";

export class ForecastServiceError extends AppError {
  constructor() {
    super("Unable to retrieve marine forecast", 502);
  }
}
