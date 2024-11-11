// import { User } from '../../shared/models/User'
import RemultFormMUI from '../../../src/RemultFormMUI'
import { remult } from 'remult'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// import { Organization } from '../../shared/models/Organization'
import { Location } from '../../shared/models/Location'

const FormRoute = () => {
	const { id } = useParams()
	// const [user, setUser] = useState<User>()
	// const [org, setOrg] = useState<Organization>()
	const [loc, setLoc] = useState<Location>()

	useEffect(() => {
		if (!id) {
			return
		}
		// remult
		// 	.repo(User)
		// 	.findId(id)
		// 	.then((u) => setUser(u!))
		// 	.catch(console.log)
		// remult
		// 	.repo(Organization)
		// 	.findId(id)
		// 	.then((o) => setOrg(o!))
		// 	.catch(console.log)
		remult
			.repo(Location)
			.findId(id)
			.then((l) => setLoc(l!))
			.catch(console.log)
	}, [id])

	return (
		<>
			{/* <RemultFormMUI
				entity={User}
				item={user}
				// uiLib='joy_ui'
				// item={remult.repo(User).create()}
				// onSubmit={(item) => console.log('onSubmit(): item', item)}
				// showId
				// fieldsToShow={['email', 'firstName', 'lastName', 'organization']}
				onDone={(item) => console.log('onDone(): item', item)}
			/> */}
			{/* <RemultFormMUI
				entity={Organization}
				item={org}
				// uiLib='joy_ui'
				// item={remult.repo(User).create()}
				// onSubmit={(item) => console.log('onSubmit(): item', item)}
				// showId
				// fieldsToShow={['email', 'firstName', 'lastName', 'organization']}
				onDone={(item) => console.log('onDone(): item', item)}
			/> */}
			<RemultFormMUI
				title={<span style={{ color: 'red' }}>Styled title</span>}
				entity={Location}
				item={loc}
				// uiLib='joy_ui'
				// item={remult.repo(User).create()}
				// onSubmit={(item) => console.log('onSubmit(): item', item)}
				// showId
				// fieldsToShow={['email', 'firstName', 'lastName', 'organization']}
				onSubmitOutside={(item) => console.log('onSubmitOutside(): item', item)}
				// onSubmitStart={(item) => console.log('onSubmitStart(): item', item)}
				// onSubmitEnd={(item) => console.log('onSubmitEnd(): item', item)}
			/>
		</>
	)
}
export default FormRoute
