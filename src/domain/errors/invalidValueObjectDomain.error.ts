import { BaseDomainError, DomainErrorType } from "@/domain/errors/baseDomain.error.js";

export class InvalidValueObjectDomainError<Value> extends BaseDomainError {
  constructor(message: string, value: Value, valueObjectName: string) {
    super(`Invalid ValueObject: ${message}`, DomainErrorType.invalidValueObject, {
      value,
      valueObjectName,
    });
  }
}
