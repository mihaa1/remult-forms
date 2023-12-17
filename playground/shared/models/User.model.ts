import { Allow, Entity, Fields, Relations, Validators } from 'remult'
import { Organization } from './Organization.model'

type Person = {
	name: string
	age: number
}

@Entity<User>('users', {
	allowApiCrud: Allow.everyone,
	validation: (row) => {
		console.log('validation(): row', row)
	},
	caption: 'User',
	saving: (row, lc) => {
		console.log('saving(): row', row)
		console.log('saving(): lc', lc)
		console.log('saving(): lc.isNew', lc.isNew)
	},
})
export class User {
	@Fields.cuid()
	id = ''

	@Fields.string({
		// caption: 'This is Email',
		// TODO: how to read required to show a required field
		validate: [Validators.required, Validators.unique],
		// allowNull: true,
		// saving: (row) => (row.email = row.email.toLowerCase()),
		// valueType: String,
		// inputType: 'string',
		required: true,
	})
	email = ''

	@Fields.string<User>({
		// displayValue: (v, val) => val.toLowerCase() || '',
	})
	email2?: string

	@Fields.boolean({
		allowApiUpdate: false,
	})
	isActive = true

	@Fields.boolean({
		includeInApi: false,
	})
	isIncludedInAPI = false

	@Fields.number({
		allowApiUpdate: Allow.everyone,
	})
	activeDays?: number

	@Fields.integer({
		allowApiUpdate: Allow.authenticated,
	})
	height?: number

	@Fields.dateOnly()
	dateOnlyField?: Date

	@Fields.createdAt()
	createdAt?: Date

	@Fields.updatedAt()
	updatedAt?: Date

	// @Fields.date({ valueType: Date })
	@Fields.date({
		inputType: 'datetime-local',
		allowApiUpdate: Allow.everyone,
	})
	birthday?: Date

	@Fields.json()
	settings?: Person

	@Fields.object()
	attributes = {}

	// User should add inputType
	@Fields.object<string[]>({
		valueConverter: {
			toInput: (val) => val.join && val?.join(', '),
			fromInput: (val) =>
				val
					?.split(',')
					.map((x) => x.trim())
					.filter((x) => x),
		},
	})
	tags: string[] = []

	@Fields.string()
	organizationId = ''
	@Relations.toOne<User, Organization>(() => Organization, {
		field: 'organizationId',
	})
	organization?: Organization
}
