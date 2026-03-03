export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class StorageError extends AppError {
  constructor(message: string) {
    super(message, "STORAGE_ERROR", 500);
    this.name = "StorageError";
  }
}

export class ProviderError extends AppError {
  constructor(message: string) {
    super(message, "PROVIDER_ERROR", 502);
    this.name = "ProviderError";
  }
}

export class WorkflowError extends AppError {
  constructor(message: string) {
    super(message, "WORKFLOW_ERROR", 500);
    this.name = "WorkflowError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}
