import { Allow, Entity, Fields, Relations, Validators, remult } from 'remult'
import { Organization } from './Organization'
import {
	SHIFT_LENGTH_DEFAULT,
	SHIFT_PERSON_COUNT_DEFAULT,
} from '../../server/consts'
import type { HourInDay, WeekStart } from '../utils/types'

@Entity<Location>('location', {
	allowApiCrud: Allow.authenticated,
	defaultOrderBy: { name: 'asc' },
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

	@Fields.string()
	firstDayOfWeek: WeekStart = 'mon'

	@Fields.string({
		validate: Validators.required,
	})
	timezone = 'Asia/Jerusalem'

	/******************** meta fields ********************/
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
