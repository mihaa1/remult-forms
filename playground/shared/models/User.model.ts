import { Allow, Entity, Fields, Validators } from 'remult'

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
}
