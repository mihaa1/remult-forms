export {}
// see more: https://github.com/noam-honig/law-q/blob/a2ab855fcaf97780759ad78cd743d033e2b2f788/src/app/common/UITools.ts
declare module 'remult' {
	export interface FieldOptions<entityType, valueType> {
		required?: boolean
		hideOnCreate?: boolean
	}
}
