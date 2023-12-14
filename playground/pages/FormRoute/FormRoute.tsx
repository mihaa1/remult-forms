import { User } from '../../shared/models/User.model'
import { RemultForm } from '../../../index'

const FormRoute = () => {
	return (
		<RemultForm entity={User} onSubmit={(item) => console.log('item', item)} />
	)
}
export default FormRoute
