import { remultExpress } from 'remult/remult-express'
import { User } from '../shared/models/User.model'

export const api = remultExpress({
	entities: [User],
})
