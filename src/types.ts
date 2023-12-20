export type ClassType<T> = {
	new (...args: any[]): T // eslint-disable-line @typescript-eslint/no-explicit-any
}
// Type to require at least one of props on a type
// https://stackoverflow.com/a/49725198/5248229
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
	T,
	Exclude<keyof T, Keys>
> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
	}[Keys]

interface SelectOptionRaw {
	id: string | number
	label?: string
	// if label is missing - values will be rendered from name prop
	name?: string
}

export type SelectOption = RequireAtLeastOne<SelectOptionRaw, 'label' | 'name'>

export type ID = string | number

export interface SingleSelectP {
	label?: string
	options: SelectOption[]
	selectedId?: ID
	disabled?: boolean
	onSelect: (arg: string | number) => void
}

export interface MultipleSelectP {
	options: SelectOption[]
	selected?: SelectOption[]
	onSelect: (arg: Pick<SelectOption, 'id'>[]) => void
	disabled?: boolean
	label?: string
}
