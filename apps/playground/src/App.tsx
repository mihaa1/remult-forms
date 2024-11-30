import './App.css'
import { useRemultForm, Controller } from 'remult-uikit'
import type { SubmitData } from 'remult-uikit'
import { User } from './shared/User'
import { remult } from 'remult'
import { TextField } from '@mui/material'

const userRepo = remult.repo(User)

function App() {
	const {
		handleSubmit,
		formState: { errors },
		register,
		control,
	} = useRemultForm(userRepo)

	const onSubmit = (data: SubmitData<User>) => {
		console.log('data', data)
	}

	console.log('errors', errors)

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
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
				// defaultValue=''
				repo={userRepo}
				render={({ field }) => {
					return <TextField {...field} />
				}}
			/>
			{errors.lastName && (
				<p style={{ color: 'red' }}>{String(errors.lastName.message)}</p>
			)}
			<input type='submit' />
		</form>
	)
}

export default App
