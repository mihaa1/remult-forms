import { User } from '../../shared/models/User.model'
import { RemultForm } from '../../../index'
import { remult } from 'remult'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const FormRoute = () => {
	const { id } = useParams()
	const [user, setUser] = useState<User>()
	useEffect(() => {
		if (!id) {
			return
		}
		remult
			.repo(User)
			.findId(id, { include: { organization: true } })
			.then(setUser)
			.catch((e) => {
				console.log('e', e)
			})
	}, [id])

	return (
		<RemultForm
			entity={User}
			item={user}
			// item={remult.repo(User).create()}
			// onSubmit={(item) => console.log('onSubmit(): item', item)}
			onDone={(item) => console.log('onDone(): item', item)}
			// hidePartial={['role']}
		/>
	)
}
export default FormRoute
