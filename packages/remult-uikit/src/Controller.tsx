import { Controller as ControllerInternal } from 'react-hook-form'
import type {
	ControllerFieldState,
	ControllerProps,
	ControllerRenderProps,
	FieldValues,
	UseFormStateReturn,
	Path,
} from 'react-hook-form'
import { getValidator, isRequired } from './util'
import { Repository } from 'remult'

type ControllerPropsWithRepo<T> = Omit<ControllerProps, 'name' | 'render'> & {
	name: keyof T
	repo: Repository<T>
	render: ControllerRenderFunctionWithRemult<FieldValues>
}

type ControllerRenderPropsWithRemult<TFieldValues extends FieldValues> =
	ControllerRenderProps<TFieldValues, Path<TFieldValues>> & {
		label: string
		'data-required'?: boolean
	}

type ControllerRenderFunctionWithRemult<TFieldValues extends FieldValues> = ({
	field,
	fieldState,
	formState,
}: {
	field: ControllerRenderPropsWithRemult<TFieldValues>
	fieldState: ControllerFieldState
	formState: UseFormStateReturn<TFieldValues>
}) => React.ReactElement

const Controller = <T,>(props: ControllerPropsWithRepo<T>) => {
	return (
		<ControllerInternal
			{...props}
			name={props.name as string}
			rules={{
				validate: getValidator(props.repo, props.name as keyof T),
			}}
			render={({ field, fieldState, formState }) => {
				// @ts-expect-error
				const isRequiredField = isRequired(props.repo.fields[props.name])
				const newField: ControllerRenderPropsWithRemult<FieldValues> = {
					...field,
					// label: `${props.repo.fields[props.name as keyof T].caption}${
					// 	isRequiredField ? ' *' : ''
					// }`,
					label: props.repo.fields[props.name as keyof T].caption,
					['data-required']: !!isRequiredField,
				}
				return props.render({ field: newField, fieldState, formState })
			}}
		/>
	)
}
export default Controller
