import { User } from '../../shared/models/User.model'
import RemultFormMUI from '../../../src/RemultFormMUI'
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
		remult.repo(User).findId(id).then(setUser).catch(console.log)
	}, [id])

	return (
		<RemultFormMUI
			entity={User}
			item={user}
			// uiLib='joy_ui'
			// item={remult.repo(User).create()}
			// onSubmit={(item) => console.log('onSubmit(): item', item)}
			// showId
			// fieldsToShow={['email', 'firstName', 'lastName', 'organization']}
			onDone={(item) => console.log('onDone(): item', item)}
		/>
	)
}
export default FormRoute
