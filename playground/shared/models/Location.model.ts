import { Allow, Entity, Fields, Relations, Validators, remult } from 'remult'
import { Organization } from './Organization.model'
import {
	Role,
	SHIFT_LENGTH_DEFAULT,
	SHIFT_PERSON_COUNT_DEFAULT,
} from '../../server/consts'
import { HourInDay } from '../../../src/types'

@Entity<Location>('location', {
	allowApiCrud: Allow.authenticated,
	allowApiInsert: [Role.SUPER_ADMIN, Role.ADMIN],
	allowApiUpdate: [Role.SUPER_ADMIN, Role.ADMIN],
	allowApiDelete: [Role.SUPER_ADMIN, Role.ADMIN],
	defaultOrderBy: { name: 'asc' },
	backendPrefilter: () => {
		if (!remult.user?.organizationId) {
			return { id: '' }
		}
		if (remult.isAllowed(Role.SUPER_ADMIN)) {
			return {}
		}
		return { organizationId: remult.user?.organizationId }
	},
	saving: (row) => {
		if (!remult.user?.internal) {
			row.organizationId = remult.user!.organizationId
		}
	},
})
export class Location {
	@Fields.cuid()
	id = ''

	@Fields.string({
		validate: Validators.required,
	})
	name = ''

	@Fields.string()
	organizationId = ''
	@Relations.toOne<Location, Organization>(() => Organization, 'organizationId')
	organization?: Organization

	@Fields.integer()
	shiftLengthHrs = SHIFT_LENGTH_DEFAULT

	@Fields.integer()
	personsPerShift = SHIFT_PERSON_COUNT_DEFAULT

	@Fields.integer()
	workingHoursStart: HourInDay = 0

	@Fields.integer()
	workingHoursEnd: HourInDay = 0

	@Fields.createdAt({
		includeInApi: false,
		allowApiUpdate: false,
	})
	createdAt = new Date()

	@Fields.updatedAt({
		includeInApi: false,
		allowApiUpdate: false,
	})
	updatedAt = new Date()

	@Fields.string<Location>({
		includeInApi: false,
		allowApiUpdate: false,
		saving: (row, _fr, lc) => {
			if (lc.isNew) {
				row.createdBy = remult.user!.email
			}
		},
	})
	createdBy = ''

	@Fields.string<Location>({
		includeInApi: false,
		allowApiUpdate: false,
		saving: (row) => (row.updatedBy = remult.user!.email),
	})
	updatedBy = ''
}
