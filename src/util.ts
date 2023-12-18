import {
	AllowedForInstance,
	FieldMetadata,
	RelationOptions,
	remult,
} from 'remult'
import { getRelationInfo } from 'remult/internals'

export const isHideField = <T>(
	f: FieldMetadata<T>,
	fields: FieldMetadata<T>[],
	isEdit: boolean,
	showId: boolean | undefined,
	showCreatedAt: boolean | undefined,
	showUpdatedAt: boolean | undefined,
	showOnly?: (keyof T)[]
) => {
	if (
		(showOnly && showOnly.length > 0 && !showOnly.includes(f.key as keyof T)) ||
		f.options.hideOnCreate ||
		isMetaActionBlocked(f.options.includeInApi)
	) {
		return true
	}
	if (f.key === 'id' || f.key === 'createdAt' || f.key === 'updatedAt') {
		return (
			!isEdit ||
			(!showId && f.key === 'id') ||
			(!showCreatedAt && f.key === 'createdAt') ||
			(!showUpdatedAt && f.key === 'updatedAt')
		)
	}
	const relationInfo = getRelationInfo(f.options)
	if (relationInfo) {
		// TODO: remove this - we no longer auto hide relation field
		return false
	} else {
		for (const otherField of fields) {
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

export const isMetaActionBlocked = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	metaAction: AllowedForInstance<any> | undefined
) => {
	if (
		metaAction === undefined ||
		metaAction === true ||
		(typeof metaAction === 'function' && metaAction() === true)
	) {
		return false
	}
	return (
		metaAction === false ||
		(typeof metaAction === 'function' && metaAction() === false) ||
		(!remult.user && !!metaAction) ||
		(remult.user && !remult.isAllowed(metaAction))
	)
}
