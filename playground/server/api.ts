import { remultExpress } from 'remult/remult-express'
import { User } from '../shared/models/User.model'
import { Organization } from '../shared/models/Organization.model'
import { Location } from '../shared/models/Location.model'

export const api = remultExpress({
	getUser: async () => {
		return Promise.resolve({
			id: 'abc',
			email: 'admin@forms.com',
			organizationId: 'hogwarts',
			roles: ['admin'],
		})
	},
	entities: [User, Organization, Location],
})
