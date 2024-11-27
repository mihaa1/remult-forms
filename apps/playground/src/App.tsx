import './App.css'
import { useRemultForm } from 'remult-uikit'
import type { SubmitData } from 'remult-uikit'
import { User } from './shared/User'
import { remult } from 'remult'

const userRepo = remult.repo(User)

function App() {
	const { handleSubmit, errors, register } = useRemultForm(userRepo)

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
			{/* <span>Last Name</span>
			<input {...register('lastName')} /> */}
			<button>Submit</button>
		</form>
	)
}

export default App
