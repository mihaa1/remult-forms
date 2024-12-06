import './App.css'
// import { repoResolver, type SubmitData } from 'remult-uikit'
import { User } from './shared/User'
import { remult, Repository } from 'remult'
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	TextField,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

const userRepo = remult.repo(User)
function Form() {
	const {
		handleSubmit,
		formState: { errors },
		register,
		control,
	} = useForm()

	const onSubmit = (data: User) => {
		console.log('data', data)
	}

	console.log('errors', errors)

	return (
		<form
			// onSubmit={handleSubmit(onSubmit)}
			style={{ display: 'flex', flexDirection: 'column' }}
		>
			<span>{userRepo.fields.email.caption}</span>
			<input {...register('email')} />
			{/* {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>} */}
			{errors.email && (
				<p style={{ color: 'red' }}>{String(errors.email.message)}</p>
			)}
			<span>{userRepo.fields.firstName.caption}</span>
			<input {...register('firstName')} />
			{errors.firstName && (
				<p style={{ color: 'red' }}>{String(errors.firstName.message)}</p>
			)}
			{/* <span>{userRepo.fields.age.caption}</span>
			<input {...register('age')} /> */}
			{/* {errors.age && <p style={{ color: 'red' }}>{errors.age}</p>} */}
			<Controller
				name='lastName'
				control={control}
				defaultValue=''
				render={({ field }) => <TextField {...field} />}
			/>
			{errors.lastName && (
				<p style={{ color: 'red' }}>{String(errors.lastName.message)}</p>
			)}

			<input type='submit' />
		</form>
	)
}

export default Form
