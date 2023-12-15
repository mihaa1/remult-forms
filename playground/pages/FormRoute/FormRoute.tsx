import { User } from '../../shared/models/User.model'
import { RemultForm } from '../../../index'
import { remult } from 'remult'

const FormRoute = () => {
	return (
		<RemultForm
			entity={User}
			// item={remult.repo(User).create()}
			onSubmit={(item) => console.log('item', item)}
		/>
	)
}
export default FormRoute
