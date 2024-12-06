// src/shared/Task.ts

import { Entity, Fields, Validators } from 'remult'

export type Role = 'superadmin' | 'admin' | 'user'

@Entity('users', {
	allowApiCrud: true,
})
export class User {
	@Fields.cuid()
	id = ''

	@Fields.string<User>({
		caption: 'First Name',
		// validate: [Validators.required],
		validate: (row) => {
			if (row.firstName.length < 5) {
				return 'First Name must be at least 5 characters long'
			}
		},
	})
	firstName = ''

	@Fields.string<User>({
		caption: 'Name',
		validate: Validators.required,
	})
	name = ''

	@Fields.string<User>({
		caption: 'Last Name',
		validate: Validators.required,
		// validate: [
		// 	Validators.required,
		// 	(row) => {
		// 		if (row.lastName.length < 5) {
		// 			return 'First Name must be at least 5 characters long'
		// 		}
		// 	},
		// ],
	})
	lastName = ''

	@Fields.string<User>({
		caption: 'Email',
		validate: [
			Validators.required,
			(row) => row.email.includes('@') || 'Email must contain @',
		],
	})
	email = ''

	@Fields.integer({
		caption: 'Age',
	})
	age?: number

	@Fields.boolean<User>({
		validate: Validators.required,
	})
	completed = false

	@Fields.string<User>({
		validate: Validators.required,
	})
	role: Role = 'user'

	@Fields.createdAt()
	createdAt?: Date
}
