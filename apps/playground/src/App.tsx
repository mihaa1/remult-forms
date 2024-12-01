import './App.css'
import { useRemultForm, Controller } from 'remult-uikit'
import type { SubmitData } from 'remult-uikit'
import { User } from './shared/User'
import { remult } from 'remult'
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	TextField,
} from '@mui/material'

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
				defaultValue=''
				repo={userRepo}
				render={({ field }) => <TextField {...field} />}
			/>
			{errors.lastName && (
				<p style={{ color: 'red' }}>{String(errors.lastName.message)}</p>
			)}
			<Controller
				name='completed'
				control={control}
				// defaultValue=''
				repo={userRepo}
				render={({ field, formState, fieldState }) => {
					return (
						<>
							<FormControlLabel
								control={<Checkbox {...field} />}
								label={field.label}
							/>
							{/* <p>{formState.isSubmitted ? 'submitted' : ''}</p>
							<p>{fieldState.isTouched ? 'touched' : ''}</p>
							<p>{fieldState.isDirty ? 'dirty' : ''}</p> */}
						</>
					)
				}}
			/>
			{errors.completed && (
				<p style={{ color: 'red' }}>{String(errors.completed.message)}</p>
			)}
			<FormControl>
				<Controller
					name='role'
					control={control}
					// rules={{ required: 'Gender is required' }}
					defaultValue=''
					repo={userRepo}
					render={({ field }) => (
						<RadioGroup {...field}>
							<FormLabel>{field.label}</FormLabel>
							<FormControlLabel value='user' control={<Radio />} label='User' />
							<FormControlLabel
								value='admin'
								control={<Radio />}
								label='Admin'
							/>
							<FormControlLabel
								value='superadmin'
								control={<Radio />}
								label='Superadmin'
							/>
						</RadioGroup>
					)}
				/>
			</FormControl>
			{errors.role && (
				<p style={{ color: 'red' }}>{String(errors.role.message)}</p>
			)}
			<input type='submit' />
		</form>
	)
}

export default App
