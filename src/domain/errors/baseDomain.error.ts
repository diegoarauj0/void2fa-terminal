export enum DomainErrorType {
  "invalidValueObject" = "INVALID_VALUE_OBJECT",
  "valueAlreadyInUse" = "VALUE_ALREADY_IN_USE", 
  "unknown" = "UNKNOWN",
}

export class BaseDomainError extends Error {
  public readonly domainErrorType: DomainErrorType;
  public readonly details?: any;
  public readonly name: string;

  constructor(message: string, domainErrorType: DomainErrorType = DomainErrorType.unknown, details?: any) {
    super(message);

    this.domainErrorType = domainErrorType;
    this.name = this.constructor.name;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
