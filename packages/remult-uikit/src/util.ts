import { FieldMetadata, Repository, Validators } from 'remult'

export const isRequired = <T>(field: FieldMetadata<any, T>) => {
	return (
		field.options.validate &&
		(field.options.validate === Validators.required ||
			(field.options.validate?.length &&
				typeof field.options.validate === 'object' &&
				!!field.options.validate.find((v) => v === Validators.required)))
	)
}

// export const getValidator = <T>(repo: Repository<T>, field: FieldMetadata<any, T>) => {
export const getValidator = <T>(repo: Repository<T>, key: keyof T) => {
	return async (value: any) => {
		const res = await repo.validate({ [key]: value } as Partial<T>, key)
		return res?.message
	}
}

export const isRequiredAndEmpty = <T>(val: any, field: FieldMetadata<any, T>) =>
	isRequired(field) && (val === null || val === undefined || val === '')

export const getFieldState = <T>(val: any, field: FieldMetadata<any, T>) => {
	if (isRequiredAndEmpty(val, field)) {
		return { [field.key]: 'This field is required' }
	}
}
