import Joi from "joi";

export const schemas = {
  encoding: Joi.string().valid("ascii", "hex", "base32", "base64").label("encoding"),
  algorithm: Joi.string().valid("sha1", "sha256", "sha512").label("algorithm"),
  counter: Joi.number().min(0).label("counter"),
  type: Joi.string().valid("HOTP", "TOTP").label("type"),
  issuer: Joi.string().min(1).max(128).label("issuer"),
  secret: Joi.string().min(1).max(128).label("secret"),
  name: Joi.string().min(1).max(128).label("name"),
  period: Joi.number().min(1).label("period"),
  digits: Joi.number().min(1).label("digits"),
  ID: Joi.string().uuid().label("ID"),
};

export const validators: Record<keyof typeof schemas, (value: string | number) => string | undefined> = {
  encoding: (value) => schemas.encoding.validate(value).error?.message,
  algorithm: (value) => schemas.algorithm.validate(value).error?.message,
  counter: (value) => schemas.counter.validate(value).error?.message,
  type: (value) => schemas.type.validate(value).error?.message,
  issuer: (value) => schemas.issuer.validate(value).error?.message,
  secret: (value) => schemas.secret.validate(value).error?.message,
  name: (value) => schemas.name.validate(value).error?.message,
  period: (value) => schemas.period.validate(value).error?.message,
  digits: (value) => schemas.digits.validate(value).error?.message,
  ID: (value) => schemas.ID.validate(value).error?.message,
};
