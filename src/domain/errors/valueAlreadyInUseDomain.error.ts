import { BaseDomainError, DomainErrorType } from "@/domain/errors/baseDomain.error.js";

export class ValueAlreadyInUseDomainError extends BaseDomainError {
  constructor(entityName: string, field: string, value: any) {
    super(`${entityName} with ${field} '${value}' is already in use.`, DomainErrorType.valueAlreadyInUse, {
      entityName,
      field,
      value,
    });
  }
}
