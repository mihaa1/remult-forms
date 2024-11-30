// import { FormEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Repository } from 'remult'
import { getValidator } from './util'
import Controller from './Controller'
export { Controller }

export type SubmitData<T> = {
	[k in keyof T]?: any
}

// type FormError<T> = {
// 	[k in keyof T]?: string
// }

export const useRemultForm = <T>(repo: Repository<T>) => {
	// const [elements, setElements] = useState<T>({} as T);
	// const [errorsX, setErrors] = useState<FormError<T>>({})

	const useFormObj = useForm()

	const register = (fieldId: keyof T) => {
		return useFormObj.register(String(fieldId), {
			// @ts-ignore
			// required: !!isRequired(repo.fields[fieldId]),
			validate: getValidator(repo, fieldId),
		})
		// return {
		// 	// onChange: (event: ChangeEvent<HTMLInputElement>) => {
		// 	//   setElements({ ...elements, [fieldId]: event.target.value });
		// 	// },
		// 	name: fieldId,
		// 	type: repo.fields[fieldId].inputType,
		// }
	}

	// const handleSubmit2 = async (
	// 	e: FormEvent<HTMLFormElement>,
	// 	onSuccess: (data: SubmitData<T>) => void
	// ) => {
	// 	e.preventDefault()

	// 	const formData = new FormData(e.currentTarget)
	// 	const dataObject = Object.fromEntries(formData.entries()) // Convert FormData to an object
	// 	let isValid = true
	// 	setformState: {
	// 		errors
	// 	}
	// 	;({})
	// 	const newErrors: FormError<T> = {}

	// 	for (const field in dataObject) {
	// 		// const fieldState = getFieldState(
	// 		//   dataObject[field],
	// 		//   // @ts-ignore TODO: fix type error
	// 		//   repo.fields[field as keyof T]
	// 		// );
	// 		// if (fieldState) {
	// 		//   setErrors({ ...errors, ...fieldState });
	// 		//   isValid = false;
	// 		// }
	// 		// @ts-ignore TODO: fix type error
	// 		const error = await repo.validate(dataObject, field)
	// 		if (error) {
	// 			// @ts-ignore TODO: fix type error
	// 			newErrors[field] = error.message
	// 			isValid = false
	// 		}
	// 	}

	// 	if (isValid) {
	// 		onSuccess(dataObject as SubmitData<T>)
	// 	} else {
	// 		setErrors(newErrors)
	// 	}
	// }
	const handleSubmit = (onSuccess: (data: SubmitData<T>) => void) =>
		useFormObj.handleSubmit(onSuccess)

	return { ...useFormObj, handleSubmit, register }
}
