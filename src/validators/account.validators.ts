import Joi from "joi";

export const accountCounterSchema = Joi.number().min(0);
export const accountDigitsSchema = Joi.number().min(1);
export const accountPeriodSchema = Joi.number().min(1);
export const accountTypeSchema = Joi.string().valid("HOTP", "TOTP");
export const accountAlgorithmSchema = Joi.string().valid("sha1", "sha256", "sha512");
export const accountEncodingSchema = Joi.string().valid("ascii", "hex", "base32", "base64");
export const accountIssuerSchema = Joi.string().min(1).max(128);
export const accountNameSchema = Joi.string().min(1).max(128);
export const accountSecretSchema = Joi.string().min(1).max(128);
export const accountIdSchema = Joi.string().min(1).max(36);
