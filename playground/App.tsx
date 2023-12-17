import { useEffect } from 'react'
import './App.css'
import {
	BrowserRouter,
	Routes as Router,
	Route,
	Navigate,
} from 'react-router-dom'
import FormRoute from './pages/FormRoute/FormRoute'
import GridRoute from './pages/GridRoute/GridRoute'

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
			<BrowserRouter>
				<Router>
					<Route path='form/:id?' element={<FormRoute />} />
					<Route path='grid' element={<GridRoute />} />
					<Route path='/' element={<Navigate to='/form' replace />} />
					<Route path='*' element={<Navigate to='/' />} />
				</Router>
			</BrowserRouter>
		</div>
	)
}

export default App
