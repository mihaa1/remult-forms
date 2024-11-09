import { Allow, Entity, Fields, Relations, Validators, remult } from 'remult'
import { Organization } from './Organization'
import { Role } from '../../server/consts'
import { DAYS } from '../utils/types'
enum Priority {
	Low = 'low',
	Medium = 'medium',
	High = 'high',
}
@Entity<User>('users', {
	allowApiCrud: Allow.authenticated,
})
export class User {
	@Fields.cuid()
	id = ''

	@Fields.string<User>({
		caption: 'email',
		validate: [Validators.required, Validators.unique],
		required: true,
		allowNull: true,
		saving: (row) => (row.email = row.email.toLowerCase()),
	})
	email = ''

	@Fields.boolean()
	isDisabled = false

	/**
	 * Synthetic users are users which were created without an email e.g.
	 * from upload users list.
	 * These users are treated the same for schedules.
	 */
	@Fields.boolean()
	isSynthetic = false

	@Fields.string()
	organizationId = ''
	@Relations.toOne<User, Organization>(() => Organization, {
		field: 'organizationId',
	})
	organization?: Organization

	@Fields.json<User>()
	locationIds: string[] = []

	@Fields.enum(() => Role)
	role = Role.USER

	@Fields.enum(() => Priority)
	priority = Priority.Low

	@Fields.string()
	phone = ''

	@Fields.string()
	firstName = ''

	@Fields.string()
	lastName = ''

	@Fields.json({
		select: {
			options: DAYS.map((d) => ({ id: d, label: d.toUpperCase() })),
			multiple: true,
			// type: 'select',
		},
	})
	availableDays = DAYS

	@Fields.json({
		select: {
			options: DAYS.map((d) => ({ id: d, label: d.toUpperCase() })),
			// multiple: true,
			type: 'select',
		},
	})
	availableDays1?: string

	/******************** meta fields ********************/
	@Fields.createdAt({
		includeInApi: [Role.ADMIN, Role.SUPER_ADMIN],
		allowApiUpdate: false,
	})
	createdAt?: Date

	@Fields.updatedAt({
		includeInApi: [Role.ADMIN, Role.SUPER_ADMIN],
		allowApiUpdate: false,
	})
	updatedAt?: Date

	@Fields.string<User>({
		includeInApi: [Role.ADMIN, Role.SUPER_ADMIN],
		allowApiUpdate: false,
		saving: (row, _fr, lc) => {
			if (lc.isNew) {
				row.createdBy = remult.user!.email
			}
		},
	})
	createdBy = ''

	@Fields.string<User>({
		includeInApi: [Role.ADMIN, Role.SUPER_ADMIN],
		allowApiUpdate: false,
		saving: (row) => (row.updatedBy = remult.user!.email),
	})
	updatedBy = ''
}
