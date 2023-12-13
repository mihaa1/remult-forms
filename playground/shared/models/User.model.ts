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
	activeDays = 999

	@Fields.date()
	birthday?: Date

	@Fields.integer()
	height?: number

	@Fields.createdAt()
	createdAt?: Date

	// Not working
	// @Fields.json()
	// settings?: Person

	@Fields.dateOnly()
	dateOnlyField?: Date
}
