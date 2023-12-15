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
	})
	email = ''

	@Fields.string({
		displayValue: (v) => v.toLowerCase(),
	})
	email2?: string

	@Fields.boolean()
	isActive = true

	@Fields.number()
	activeDays?: number

	@Fields.integer()
	height?: number

	@Fields.dateOnly()
	dateOnlyField?: Date

	@Fields.createdAt()
	createdAt?: Date

	@Fields.updatedAt()
	updatedAt?: Date

	// TODO: Not showing as date - inputType is not date as in dateOnly
	@Fields.date()
	birthday?: Date

	// TODO: Throws error
	@Fields.json()
	settings?: Person

	// TODO: this gives inputType=text
	@Fields.object()
	attributes = {}

	// TODO: how to know that this is a relation?
	// show a select instead of 2 text fields
	@Fields.string()
	organizationId = ''
	@Relations.toOne<User, Organization>(() => Organization, {
		field: 'organizationId',
	})
	organization?: Organization
}
