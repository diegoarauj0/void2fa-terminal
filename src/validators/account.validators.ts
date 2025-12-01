import Joi from "joi";

export const accountCounter = Joi.number().min(0);
export const accountDigits = Joi.number().min(1);
export const accountPeriod = Joi.number().min(1);
export const accountType = Joi.string().valid("HOTP", "TOTP");
export const accountAlgorithm = Joi.string().valid("sha1", "sha256", "sha512");
export const accountEncoding = Joi.string().valid("ascii", "hex", "base32", "base64");
export const accountIssuer = Joi.string().min(1).max(128);
export const accountName = Joi.string().min(1).max(128);
export const accountSecret = Joi.string().min(1).max(128);
export const accountId = Joi.string().min(1).max(36);
