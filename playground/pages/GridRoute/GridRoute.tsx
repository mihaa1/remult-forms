import { User } from '../../shared/models/User.model'
import { RemultGrid as RemultGridMRT } from '../../../src/views/RemultGrid-MRT'
import { RemultGrid } from '../../../src/views/RemultGrid'

const GridRoute = () => {
	return (
		<>
			<RemultGrid
				entity={User}
				showId
				// fieldsToShow={[
				// 	'id',
				// 	'email',
				// 	'workingHoursStart',
				// 	'organization',
				// 	'isDisabled',
				// 	'age',
				// 	'firstName',
				// 	'lastName',
				// ]}
				// gridOptions={{ checkboxSelection: false }}
			/>
			{/* <RemultGridMRT
				entity={User}
				showId
				fieldsToShow={[
					// 'id',
					'email',
					'workingHoursStart',
					// 'organization',
					'firstName',
					'isDisabled',
					'age',
					'lastName',
				]}
				uiLib='mrt'
				// gridOptions={{ checkboxSelection: false }}
			/> */}
		</>
	)
}

export default GridRoute
