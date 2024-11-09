import {
	FieldMetadata,
	FieldsMetadata,
	RelationOptions,
	Validators,
	remult,
} from 'remult'
import { getRelationInfo } from 'remult/internals'

export const isHideField = <T>(
	f: FieldMetadata<T>,
	entityFields: FieldMetadata<T>[],
	isEdit: boolean,
	showId: boolean | undefined,
	showCreatedAt: boolean | undefined,
	showUpdatedAt: boolean | undefined,
	fieldsToShow: (keyof T)[]
) => {
	if (f.key === 'id' || f.key === 'createdAt' || f.key === 'updatedAt') {
		if (fieldsToShow?.length && fieldsToShow.includes(f.key as keyof T)) {
			return false
		}
		return (
			!isEdit ||
			(!showId && f.key === 'id') ||
			(!showCreatedAt && f.key === 'createdAt') ||
			(!showUpdatedAt && f.key === 'updatedAt')
		)
	}
	if (
		(fieldsToShow?.length && !fieldsToShow.includes(f.key as keyof T)) ||
		(f.options.hideOnCreate && !isEdit) ||
		remult.isAllowedForInstance(undefined, f.options.includeInApi) === false
	) {
		return true
	}

	const relationInfo = getRelationInfo(f.options)
	if (relationInfo) {
		// TODO: remove this - we no longer auto hide relation field
		return false
	} else {
		for (const otherField of entityFields) {
			// Check related field of relation - when defined using options.field
			// TODO: support fields - that use as relation 2 columns
			const relationInfo = getRelationInfo(otherField.options)
			if (
				relationInfo &&
				(otherField.options as RelationOptions<T, typeof relationInfo, string>)
					.field === f.key
			) {
				return true
			}
		}
	}
}

// export const isMetaActionBlocked = (
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	metaAction: AllowedForInstance<any> | undefined
// ) => {
// 	if (
// 		metaAction === undefined ||
// 		metaAction === true ||
// 		(typeof metaAction === 'function' && metaAction() === true)
// 	) {
// 		return false
// 	}
// 	return (
// 		metaAction === false ||
// 		(typeof metaAction === 'function' && metaAction() === false) ||
// 		(!remult.user && !!metaAction) ||
// 		(remult.user && !remult.isAllowed(metaAction))
// 	)
// }

export const getFieldType = <T>(f: FieldMetadata<T>) => {
	const relationInfo = getRelationInfo(f.options)
	if (relationInfo && relationInfo.type === 'toOne') {
		return 'singleSelect'
	} else if (f.options.select) {
		if (f.options.select.multiple) {
			return 'multiSelect'
		}
		return 'singleSelect'
	} else if (f.inputType === 'text') {
		return 'string'
	} else if (!f.inputType) {
		if (f.options?.valueType && Object.keys(f.options.valueType).length) {
			return 'singleSelect'
		}
		return 'string'
	} else if (f.inputType === 'number') {
		return 'number'
	} else if (f.inputType === 'checkbox') {
		return 'boolean'
	} else if (f.inputType === 'date' || f.inputType === 'datetime-local') {
		return 'date'
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRequired = <T>(field: FieldMetadata<any, T>) => {
	return (
		field.options.validate &&
		(field.options.validate === Validators.required ||
			(field.options.validate?.length &&
				typeof field.options.validate === 'object' &&
				field.options.validate.find((v) => v === Validators.required)))
	)
}

export const loadRelations = async <T>(
	fields: FieldsMetadata<T> | undefined,
	fieldsToShow: (keyof T)[]
) => {
	if (!fields) {
		return
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const res: any = {}
	for (const f of fields.toArray()) {
		if (fieldsToShow.length && fieldsToShow.indexOf(f.key as keyof T) === -1) {
			continue
		}
		const relationInfo = getRelationInfo(f.options)
		if (relationInfo) {
			const relatedEntities = await remult.repo(relationInfo.toType()).find()
			res[f.key] = relatedEntities
		}
	}
	return res
}

export const getSelectOptions = <T>(f: FieldMetadata<T>) => {
	if (f.options.select?.options) {
		return f.options.select.options
	} else if (f.options.valueType) {
		return Object.keys(f.options.valueType).map((key) => ({
			id: f.options.valueType[key],
			label: f.options.valueType[key],
		}))
	}
	return []
}
