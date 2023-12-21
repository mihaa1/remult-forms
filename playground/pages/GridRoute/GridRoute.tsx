import { User } from '../../shared/models/User.model'
import { RemultGrid } from '../../../src/views/RemultGrid'

const GridRoute = () => {
	return (
		<RemultGrid
			entity={User}
			showId
			sort={['id', 'email', 'firstName', 'lastName']}
		/>
	)
}

export default GridRoute
