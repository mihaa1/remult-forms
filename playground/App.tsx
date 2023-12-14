import { useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { RemultForm } from '../index'
import { User } from './shared/models/User.model'
// import { remult } from 'remult'

function App() {
	// const [count, setCount] = useState(0)
	useEffect(() => {
		// remult
		// 	.repo(User)
		// 	.find()
		// 	.then((res) => console.log('users', res))
		// const user = remult.repo(User).create()
		// user.email = 'why like this'
		// console.log('app user', user)
		// remult
		// 	.repo(User)
		// 	.save(user)
		// 	.then((res) => {
		// 		console.log('save res', res)
		// 	})
	}, [])

	return (
		<div style={{ width: '80%' }}>
			<RemultForm entity={User} />
		</div>
	)
}

export default App
