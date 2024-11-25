import './App.css'
import { useRemultForm } from 'remult-uikit'
import type { SubmitData } from 'remult-uikit'
import { User } from './shared/User'
import { remult } from 'remult'

const userRepo = remult.repo(User)

function App() {
	const { subscribe, handleSubmit, errors } = useRemultForm(userRepo)

	const onSubmit = (data: SubmitData<User>) => {
		console.log('data', data)
	}

	return (
		<form
			onSubmit={(e) => handleSubmit(e, onSubmit)}
			style={{ display: 'flex', flexDirection: 'column' }}
		>
			<span>{userRepo.fields.email.caption}</span>
			<input {...subscribe('email')} />
			{errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
			<span>{userRepo.fields.firstName.caption}</span>
			<input {...subscribe('firstName')} />
			{errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
			<span>{userRepo.fields.age.caption}</span>
			<input {...subscribe('age')} />
			{errors.age && <p style={{ color: 'red' }}>{errors.age}</p>}
			<button>Submit</button>
		</form>
	)
}

export default App
