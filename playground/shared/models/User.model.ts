import { Allow, Entity, Fields, Validators } from 'remult'

// type Person = {
// 	name: string
// 	age: number
// }

@Entity<User>('users', {
	allowApiCrud: Allow.everyone,
})
export class User {
	@Fields.uuid()
	id = ''

	@Fields.string({
		caption: 'This is Email',
		validate: [Validators.required],
		// allowNull: true,
		// saving: (row) => (row.email = row.email.toLowerCase()),
	})
	email = ''

	@Fields.string()
	email2?: string

	@Fields.boolean({
		defaultValue: () => true,
	})
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
