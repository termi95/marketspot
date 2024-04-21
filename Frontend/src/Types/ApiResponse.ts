export interface ApiResponse {
  isSuccess: boolean;
  result: object;
  statusCode: number;
  errorsMessages: [string];
}
