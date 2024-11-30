import { Controller as ControllerInternal } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form'
import { getValidator, isRequired } from './util'
import { Repository } from 'remult'

type ControllerPropsWithRepo<T> = Omit<ControllerProps, 'name'> & {
	name: keyof T
	repo: Repository<T>
}

const Controller = <T,>(props: ControllerPropsWithRepo<T>) => {
	return (
		<ControllerInternal
			{...props}
			name={props.name as string}
			rules={{
				validate: getValidator(props.repo, props.name as keyof T),
			}}
			render={({ field, fieldState, formState }) => {
				const newField = {
					...field,
					label: props.repo.fields[props.name as keyof T].caption,
					// @ts-expect-error
					required: isRequired(props.repo.fields[props.name]),
				}
				return props.render({ field: newField, fieldState, formState })
			}}
		/>
	)
}
export default Controller
