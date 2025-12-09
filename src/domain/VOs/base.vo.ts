import { InvalidValueObjectDomainError } from "@/domain/errors/invalidValueObjectDomain.error.js";

export class BaseVO<Value> {
  constructor(protected readonly value: Value, validate: (value: Value) => string | undefined, valueObjectName: string) {
    const result = validate(value);

    if (result !== undefined) {
      throw new InvalidValueObjectDomainError<Value>(result, value, valueObjectName);
    }
  }

  public toValue(): Value {
    return this.value;
  }

  public equal(vo: this): boolean {
    return this.toValue() === vo.toValue()
  }
}
