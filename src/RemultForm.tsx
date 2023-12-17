/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	ChangeEvent,
	FormEvent,
	ReactNode,
	useEffect,
	useReducer,
	useState,
} from 'react'
import { FieldMetadata, FieldsMetadata, RelationOptions, remult } from 'remult'
import RemultTextField from './components/Textfield'
import { Box, Button, Typography } from '@mui/material'
import RemultCheckbox from './components/Checkbox'
import RemultDatepicker from './components/Datepicker'
import type { ClassType } from './types'
import { getRelationInfo } from 'remult/internals'

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
}: RemultFormP<T>): ReactNode => {
	const [isEdit, setIsEdit] = useState(false)
	// const [item, setItem] = useState<T>();
	// const [internalItem, setInternalItem] = useState<T>(
	// 	item ? { ...item } : remult.repo(entity).create()
	// )
	const [state, dispatch] = useReducer(
		reducer,
		// item ? { ...item } : remult.repo(entity).create()
		{}
	)
	const repo = remult.repo(entity)

	useEffect(() => {
		dispatch(item)
		setIsEdit(!!item)
	}, [item])

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

	const onSubmitInternal = async (e: FormEvent<HTMLFormElement>) => {
		console.log('e', e.preventDefault())
		console.log('onSubmitInternal(): state', state)
		if (onSubmit) {
			return onSubmit(state)
		}
		if (isEdit) {
			return await onEdit()
		}
		return await onCreate()
	}

	const onEdit = async () => {
		const res = await repo.save(state)
		console.log('onEdit(): res', res)
		onDone && onDone(res)
	}

	const onCreate = async () => {
		const res = await repo.insert(state)
		console.log('onCreate(): res', res)
		onDone && onDone(res)
	}

	const isHideField = (f: FieldMetadata<T>, fields: FieldMetadata<T>[]) => {
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
			return true
		} else {
			for (const otherField of fields) {
				// Check related field of relation - when defined using options.field
				// TODO: support fields - that use as relation 2 columns
				const relationInfo = getRelationInfo(otherField.options)
				if (
					relationInfo &&
					(
						otherField.options as RelationOptions<
							T,
							typeof relationInfo,
							string
						>
					).field === f.key
				) {
					return true
				}
			}
		}
	}

	const renderForm = <T,>(fields: FieldsMetadata<T>) => {
		return fields.toArray().map((f) => {
			if (isHideField(f, fields.toArray())) {
				return
			}

			console.log('============')
			console.log('f', f)
			const rawVal = state[f.key as keyof typeof state]
			if (!f.inputType || f.inputType === 'text' || f.inputType === 'number') {
				// TODO: use fromInput, toInput
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
						onChange={onChangeTextfield}
					/>
				)
			} else if (f.inputType === 'checkbox') {
				return (
					<RemultCheckbox
						key={`${f.key}`}
						val={!!rawVal}
						field={f}
						onChange={onChangeCheckbox}
					/>
				)
			} else if (f.inputType === 'date' || f.inputType === 'datetime-local') {
				return (
					<RemultDatepicker
						key={`${f.key}`}
						field={f}
						onChange={onChangeDate}
					/>
				)
			}
		})
	}

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
