import { Allow, Entity, Fields, Validators, remult } from 'remult'
import {
	SHIFT_LENGTH_DEFAULT,
	SHIFT_PERSON_COUNT_DEFAULT,
} from '../../server/consts'
import type { HourInDay, RequestsToAPILimit, UsagePlan } from '../utils/types'

@Entity<Organization>('organization', {
	allowApiRead: Allow.authenticated,
})
export class Organization {
	@Fields.cuid()
	id = ''

	@Fields.string({
		validate: [Validators.required, Validators.unique],
	})
	name = ''

	@Fields.integer()
	shiftLengthHrs = SHIFT_LENGTH_DEFAULT

	@Fields.integer()
	personsPerShift = SHIFT_PERSON_COUNT_DEFAULT

	@Fields.integer()
	workingHoursStart: HourInDay = 0

	@Fields.integer()
	workingHoursEnd: HourInDay = 0

	@Fields.object()
	requestsToAPILimit: RequestsToAPILimit = {
		day: 50,
	}

	@Fields.string()
	plan: UsagePlan = ''

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

	@Fields.string<Organization>({
		includeInApi: false,
		allowApiUpdate: false,
		saving: (row, _fr, lc) => {
			if (lc.isNew) {
				row.createdBy = remult.user!.email
			}
		},
	})
	createdBy = ''

	@Fields.string<Organization>({
		includeInApi: false,
		allowApiUpdate: false,
		saving: (row) => (row.updatedBy = remult.user!.email),
	})
	updatedBy = ''
}
