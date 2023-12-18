/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	ChangeEvent,
	FormEvent,
	ReactNode,
	useEffect,
	useReducer,
	useState,
} from 'react'
import { remult } from 'remult'
import type { FieldMetadata, FieldsMetadata } from 'remult'
import { Box, Button, Typography } from '@mui/material'
import type { ClassType } from './types'
import { isHideField } from './util'
import { getRelationInfo } from 'remult/internals'
import RemultTextField from './components/Textfield'
import RemultCheckbox from './components/Checkbox'
import RemultDatepicker from './components/Datepicker'
import RemultAutocomplete from './components/Autocomplete'
import type { AutocompleteOption } from './components/Autocomplete'

const reducer = <T,>(state: T, action: any) => {
	return {
		...state,
		...action,
	}
}

interface RemultFormP<T> {
	/** Model to generate form for */
	entity: ClassType<T>
	/** Existing model instance if edit case. Empty for create */
	item?: T
	/** Show item id */
	showId?: boolean
	/** Show createdAt */
	showCreatedAt?: boolean
	/** Show updatedAt */
	showUpdatedAt?: boolean
	/** Custom form title */
	title?: string
	/** Trigger on form submit. This will pass the created/edited item and will NOT perform the action. */
	onSubmit?: (item: T | undefined) => void
	/** Trigger on action completed. When create/edit action is done this will be fired */
	onDone?: (item: T[] | undefined) => void
	/** Show these fields in form from the provided entity. PROVIDE ONLY ONE OF showPartial OR hidePartial */
	showPartial?: (keyof T)[]
	/** Hide these fields in form from the provided entity. PROVIDE ONLY ONE OF hidePartial OR showPartial */
	hidePartial?: (keyof T)[]
}

export const RemultForm = <T,>({
	entity,
	item,
	showId,
	showCreatedAt,
	showUpdatedAt,
	title,
	onSubmit,
	onDone,
	showPartial,
	hidePartial,
}: RemultFormP<T>): ReactNode => {
	const [isEdit, setIsEdit] = useState(false)
	const [relations, setRelations] = useState<
		{ [k in keyof Partial<T>]: any[] } | Record<string, never>
	>({})

	const [state, dispatch] = useReducer(
		reducer,
		// item ? { ...item } : remult.repo(entity).create()
		{}
	)

	const repo = remult.repo(entity)

	useEffect(() => {
		dispatch(item ? { ...item } : remult.repo(entity).create())
		loadRelations(repo.fields)
		setIsEdit(!!item)
	}, [item, entity])

	const loadRelations = async (fields: FieldsMetadata<T>) => {
		const res: any = {}
		for (const f of fields.toArray()) {
			const relationInfo = getRelationInfo(f.options)
			if (relationInfo) {
				const relatedEntities = await remult.repo(relationInfo.toType()).find()
				res[f.key] = relatedEntities
			}
		}
		setRelations({ ...res })
	}

	const onChangeTextfield = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		key: string
	) => {
		// setInternalItem({ ...internalItem, [key]: e.target.value })
		// item.email = e.target.value
		// setItem(item)
		dispatch({
			[key]: e.target.value,
		})
	}

	const onChangeCheckbox = (e: ChangeEvent<HTMLInputElement>, key: string) =>
		dispatch({
			[key]: e.target.checked,
		})

	const onChangeDate = (newDate: unknown, key: string) =>
		dispatch({
			[key]: new Date(newDate as any),
		})

	const onSelectAutocomplete = <T,>(
		selected: AutocompleteOption,
		field: FieldMetadata<any, T>
	) => {
		dispatch({ [field.key]: { id: selected.id } })
	}

	const resetForm = () => dispatch(remult.repo(entity).create())

	const onSubmitInternal = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (onSubmit) {
			onSubmit(state)
			return resetForm()
		}
		if (isEdit) {
			await onEdit()
		} else {
			await onCreate()
		}
		resetForm()
	}

	const onEdit = async () => {
		const res = await repo.save(state)
		onDone && onDone(res)
	}

	const onCreate = async () => {
		const res = await repo.insert(state)
		onDone && onDone(res)
	}

	const renderForm = <T,>(fields: FieldsMetadata<T>) => {
		return fields.toArray().map((f) => {
			if (
				isHideField(
					f,
					fields.toArray(),
					isEdit,
					showId,
					showCreatedAt,
					showUpdatedAt,
					showPartial,
					hidePartial
				)
			) {
				return
			}

			const rawVal = state[f.key as keyof typeof state]
			const relationInfo = getRelationInfo(f.options)
			// @ts-expect-error TODO: how to do keyof Partial<T>
			// Thought of using PropertyKey as suggested here:
			// https://stackoverflow.com/a/71531880/5248229
			// but this created other issues
			if (relationInfo && relations[f.key]) {
				// @ts-expect-error TODO: fix
				const mapped = relations[f.key].map((r: any) => ({
					id: r.id,
					label: r.name,
				}))
				return (
					<RemultAutocomplete
						key={`${f.key}`}
						onSelect={(newVal) => onSelectAutocomplete(newVal, f)}
						options={mapped}
						label={f.key}
						// @ts-expect-error TODO: fix this
						selectedId={state[f.options.field]}
					/>
				)
			} else if (
				!f.inputType ||
				f.inputType === 'text' ||
				f.inputType === 'number'
			) {
				// if (f.valueType == String || f.valueType == Number) {
				return (
					<RemultTextField
						key={`${f.key}`}
						// val={state[f.key as keyof typeof state]}
						val={
							(rawVal &&
								f.valueConverter.toInput &&
								f.valueConverter.toInput(rawVal)) ||
							rawVal
						}
						field={f}
						onChange={(e) => onChangeTextfield(e, f.key)}
					/>
				)
			} else if (f.inputType === 'checkbox') {
				return (
					<RemultCheckbox
						key={`${f.key}`}
						val={!!rawVal}
						field={f}
						onChange={(e) => onChangeCheckbox(e, f.key)}
					/>
				)
			} else if (f.inputType === 'date' || f.inputType === 'datetime-local') {
				return (
					<RemultDatepicker
						key={`${f.key}`}
						field={f}
						onChange={(newDate) => onChangeDate(newDate, f.key)}
					/>
				)
			}
		})
	}

	console.log('xxx state', state)
	console.log('xxx relations', relations)

	return (
		<Box
			component='form'
			onSubmit={onSubmitInternal}
			sx={{ display: 'flex', flexDirection: 'column' }}
		>
			<Typography>
				{title || `${isEdit ? 'Edit ' : 'Create'} ${repo.metadata.caption}`}
			</Typography>
			{renderForm(repo.fields)}
			<Button type='submit' sx={{ m: 1 }} variant='contained'>
				Create
			</Button>
		</Box>
	)
}
