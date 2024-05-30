export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message,401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message,403);
  }
}

export class InternalServerError extends CustomError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

export class NoContentError extends CustomError {
  constructor(message = 'No Content') {
    super(message, 204);
  }

}