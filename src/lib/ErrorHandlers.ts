import { ValidationError, ValidationErrorItem } from "objection";
import { ValidationError as AjvValidationError, ErrorObject } from "ajv";

interface ApiValidationError {
    data: {
        message: string,
        errors?: { [key: string]: string }
    }
}

export function handleModelValidationError(err: ValidationError): ApiValidationError {
    const errors: ApiValidationError['data']['errors'] = {}
    if (err.data) {
        for (let [column, error] of Object.entries<ValidationErrorItem[]>(err.data)) {
            errors[column] = error[0].message
        }
    }

    return {
        data: {
            message: err.message,
            errors: errors || undefined,
        }
    }
}

export function handleRequestValidationError(err: AjvValidationError): ApiValidationError {
    const errors: ApiValidationError['data']['errors'] = {}
    err.errors.forEach((err) => {
        if (err.propertyName) {
            errors[err.propertyName] = err.message || 'The value was invalid'
        }
    })

    return {
        data: {
            message: err.message,
            errors: errors || undefined,
        }
    }
}