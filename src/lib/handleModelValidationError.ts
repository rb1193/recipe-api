import { ValidationError, ErrorHash, ValidationErrorItem } from "objection";

interface ApiValidationError {
    data: {
        message: string,
        errors?: { [key: string]: string }
    }
}

export default function handleModelValidationError(err: ValidationError): ApiValidationError {
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