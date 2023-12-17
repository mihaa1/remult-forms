import { FieldMetadata, remult } from 'remult'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isDisabled = <T>(field: FieldMetadata<any, T>) => {
	if (
		field.options.allowApiUpdate === true ||
		(typeof field.options.allowApiUpdate === 'function' &&
			field.options.allowApiUpdate() === true)
	) {
		return false
	}
	return (
		field.options.allowApiUpdate === false ||
		(typeof field.options.allowApiUpdate === 'function' &&
			field.options.allowApiUpdate() === false) ||
		(!remult.user && !!field.options.allowApiUpdate) ||
		(remult.user && !remult.isAllowed(field.options.allowApiUpdate))
	)
}
