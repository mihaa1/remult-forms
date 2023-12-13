import { Allow, Entity, Fields, Validators } from 'remult'

// type Person = {
// 	name: string
// 	age: number
// }

@Entity<User>('users', {
	allowApiCrud: Allow.everyone,
	validation: (row) => {
		console.log('validation(): row', row)
	},
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

	@Fields.string()
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

	// TODO: Not showing as date - inputType is not date as in dateOnly
	@Fields.date()
	birthday?: Date

	// TODO: Not working
	// @Fields.json()
	// settings?: Person

	// TODO: this gives inputType=text
	@Fields.object()
	attributes = {}
}
