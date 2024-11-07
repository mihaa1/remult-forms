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
import { remult } from 'remult'
import { User } from './shared/models/User'
import { Organization } from './shared/models/Organization'
import { ThemeProvider, createTheme } from '@mui/material/styles'
console.log('123')
function App() {
	// const [count, setCount] = useState(0)
	Object.assign(globalThis, { remult, User })
	Object.assign(globalThis, { remult, Organization })
	const theme = createTheme()

	useEffect(() => {
		remult.user = {
			id: 'abc',
			email: 'admin@forms.com',
			organizationId: 'hogwarts',
		}
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
		<ThemeProvider theme={theme}>
			<div style={{ width: '100%' }}>
				<BrowserRouter>
					<Router>
						<Route path='form/:id?' element={<FormRoute />} />
						<Route path='grid' element={<GridRoute />} />
						<Route path='/' element={<Navigate to='/form' replace />} />
						<Route path='*' element={<Navigate to='/' />} />
					</Router>
				</BrowserRouter>
			</div>
		</ThemeProvider>
	)
}

export default App
