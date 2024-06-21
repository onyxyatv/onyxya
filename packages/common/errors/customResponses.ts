export class CustomResponse {
  statusCode: number;
  success: boolean;

  constructor(statusCode: number, success: boolean) {
    this.statusCode = statusCode;
    this.success = success;
  }
}

export class SuccessResponse extends CustomResponse {
  constructor() {
    super(200, true);
  }
}