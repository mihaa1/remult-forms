import { remultExpress } from 'remult/remult-express'
import { User } from '../shared/models/User'
import { Organization } from '../shared/models/Organization'
import { Location } from '../shared/models/Location'

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
