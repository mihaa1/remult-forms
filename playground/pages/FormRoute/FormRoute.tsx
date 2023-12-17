import { User } from '../../shared/models/User.model'
import { RemultForm } from '../../../index'
import { remult } from 'remult'
import { useEffect } from 'react'
import { Organization } from '../../shared/models/Organization.model'

const FormRoute = () => {
	useEffect(() => {
		// remult
		// 	.repo(Organization)
		// 	.insert({ name: 'org1' })
		// 	.then((res) => {
		// 		console.log('org res', res)
		// 	})
		// 	.catch((e) => {
		// 		console.log('e', e)
		// 	})
		remult
			.repo(User)
			.findId('3225344e-b71d-4470-93b4-05456461d60a')
			.then(async (res) => {
				console.log('res', res)
				console.log('repo', remult.repo(User))
				console.log('email', remult.repo(User).fields.email)
				// for (const key in remult.repo(User).fields.email) {
				// 	console.log('key', key, remult.repo(User).fields.email[key])
				// }
				console.log('birthday', remult.repo(User).fields.birthday)
				console.log(
					'birthday.valueType',
					remult.repo(User).fields.birthday?.valueType
				)
				// console.log(
				// 	'typeof birthday.valueType',
				// 	typeof remult.repo(User).fields.birthday?.valueType()
				// )

				// console.log(
				// 	'instanceof birthday.valueType',
				// 	remult.repo(User).fields.birthday?.valueType() instanceof Date
				// )
				// console.log(
				// 	'dateOnlyField.valueType',
				// 	remult.repo(User).fields.dateOnlyField?.valueType
				// )
				// console.log('res._', res._)
				// console.log('>>> relations', remult.repo(User).relations(res))
				// console.log('>>> relations', remult.repo(User).relations(res))
				// console.log(
				// 	'>>> relations',
				// 	await remult.repo(User).met
				// )
				// console.log('>>> relations', remult.repo(User).relations(res).settings)
				// console.log('>>> relations', remult.repo(User).relations(res).tags)
			})
	}, [])
	return (
		<RemultForm
			entity={User}
			// item={remult.repo(User).create()}
			// onSubmit={(item) => console.log('onSubmit(): item', item)}
			onDone={(item) => console.log('onDone(): item', item)}
		/>
	)
}
export default FormRoute
