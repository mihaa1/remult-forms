import { User } from '../../shared/models/User'
import RemultGridMUI from '../../../src/RemultGridMUI'
// import RemultGridMRT from '../../../src/RemultGridMRT'

const GridRoute = () => {
	return (
		<>
			<RemultGridMUI
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
					// 'workingHoursStart',
					// 'organization',
					'firstName',
					'isDisabled',
					// 'age',
					'lastName',
				]}
				// gridOptions={{ checkboxSelection: false }}
			/> */}
		</>
	)
}

export default GridRoute
