import { remultExpress } from 'remult/remult-express'
import { User } from '../shared/models/User.model'
import { Organization } from '../shared/models/Organization.model'

export const api = remultExpress({
	entities: [User, Organization],
})
