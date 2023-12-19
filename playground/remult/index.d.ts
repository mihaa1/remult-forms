export {}
// see more: https://github.com/noam-honig/law-q/blob/a2ab855fcaf97780759ad78cd743d033e2b2f788/src/app/common/UITools.ts
declare module 'remult' {
	export interface UserInfo {
		email: string
		organizationId: string
		internal?: boolean
	}
	export interface FieldOptions<entityType, valueType> {
		required?: boolean
		hideOnCreate?: boolean
		multiSelect?: {
			options: { id: string | number; label: string }[]
			type?: 'select' | 'checkbox'
		}
	}
}
