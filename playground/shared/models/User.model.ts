import { Allow, Entity, Fields, Relations, Validators, remult } from 'remult'
import { Role, WORKING_HOURS } from '../../server/consts'
import { Organization } from './Organization.model'
// import { AttributeXUser } from './Attribute-X-User'
import { Location } from './Location.model'
import { DAYS, HourInDay } from '../../types'

@Entity<User>('users', {
	allowApiCrud: Allow.authenticated,
	allowApiInsert: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER],
	allowApiUpdate: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER],
	allowApiDelete: [Role.SUPER_ADMIN, Role.ADMIN],
	// validation: async (user) => {
	// 	if (!remult.user) {
	// 		console.error(
	// 			`Error: User.validation(): Missing user. This shouldn't happen`
	// 		)
	// 		throw new Error('Missing user')
	// 	}
	// 	if (remult.isAllowed(Role.USER)) {
	// 		if (
	// 			(user.id && user.id !== remult.user?.id) ||
	// 			(user.email && user.email !== remult.user?.email)
	// 		) {
	// 			console.error(
	// 				`Bad action: User cannot create other users. User ${remult.user?.email} trying to create ${user.email}`
	// 			)
	// 			throw new Error('Bad action: User cannot operate on other users')
	// 		}
	// 	}
	// 	if (remult.isAllowed(Role.ADMIN) || remult.isAllowed(Role.USER)) {
	// 		// user sent org id in query
	// 		if (user.organizationId) {
	// 			// user doesn't have org
	// 			if (!remult.user.organizationId) {
	// 				if (await remult.repo(Organization).findId(user.organizationId)) {
	// 					console.error(
	// 						`Bad action: User cannot use org that exists. User ${remult.user?.email} trying to do something with ${user.organizationId}`
	// 					)
	// 					throw new Error(
	// 						`Bad action: User cannot use org ${user.organizationId}`
	// 					)
	// 				}
	// 			}
	// 			// user has org but is using not her org id
	// 			if (
	// 				remult.user.organizationId &&
	// 				user.organizationId !== remult.user.organizationId
	// 			) {
	// 				// check if org exists - if not - can create
	// 				if (await remult.repo(Organization).findId(user.organizationId)) {
	// 					console.error(
	// 						`Bad action: User cannot use org other than her own. User ${remult.user?.email} trying to do something with ${user.organizationId}`
	// 					)
	// 					throw new Error(
	// 						`Bad action: User cannot use org ${user.organizationId}`
	// 					)
	// 				}
	// 			}
	// 		}
	// 	}
	// },
	// apiRequireId: true,
	// apiPrefilter: () => {
	// 	if (remult.isAllowed(Role.ADMIN)) {
	// 		return {
	// 			organizationId: remult.user!.organizationId,
	// 			role: [Role.USER, Role.ADMIN],
	// 		}
	// 	}
	// 	if (remult.isAllowed(Role.USER)) {
	// 		if (!remult.user!.organizationId) {
	// 			return { id: remult.user!.id }
	// 		}
	// 		return {
	// 			organizationId: remult.user!.organizationId,
	// 			role: [Role.USER, Role.ADMIN],
	// 		}
	// 	}
	// 	return {}
	// },
	// backendPrefilter: async () => {
	// 	if (!remult.user) {
	// 		console.error(
	// 			`Error: User.backendPrefilter(): Missing user. This shouldn't happen`
	// 		)
	// 		throw new Error('Missing user')
	// 	}
	// 	if (remult.isAllowed(Role.USER)) {
	// 		// user can act on herself only
	// 		// return { email: remult.user.email }
	// 		return {}
	// 	}
	// 	if (remult.isAllowed(Role.ADMIN)) {
	// 		if (
	// 			!(await remult.repo(Organization).findId(remult.user.organizationId))
	// 		) {
	// 			// admin without an org cannot see other users
	// 			return {
	// 				id: remult.user?.id,
	// 			}
	// 		}
	// 		// THIS WAS FIXED IN API PREFILTER - using the same validation
	// 		// {organizationId: remult.user.organizationId}
	// 		// const sql = await SqlDatabase.getDb();
	// 		// // SqlDatabase.LogToConsole = true;
	// 		// const command = sql.createCommand();
	// 		// const res = await command.execute(
	// 		//   `
	// 		// 		SELECT * FROM users
	// 		// 		WHERE organizationId=${command.addParameterAndReturnSqlToken(
	// 		//       remult.user.organizationId
	// 		//     )}
	// 		// 	`
	// 		// );
	// 		// on the field doesn't work with the prefilter defined for admin.
	// 		// See bug 1 in todo.txt
	// 		// I tried to return here {organizationId: remult.user.organizationId}
	// 		// but this makes the validation scoped to the organization id.
	// 		// e.g. it allows to create 2 users in 2 different orgs with the same email
	// 		// return { id: res.rows.map((u) => u.id) };
	// 	}
	// 	return {}
	// },
	// saving: async (user, lc) => {
	// 	if (remult.isAllowed(Role.ADMIN) && lc.isNew) {
	// 		user.organizationId = remult.user!.organizationId
	// 	}
	// },
})
export class User {
	@Fields.uuid()
	id = ''

	@Fields.string({
		validate: [Validators.required, Validators.uniqueOnBackend],
		// required: true,
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
	@Fields.boolean({
		includeInApi: false,
	})
	isSynthetic = false

	@Fields.string({
		// only SUPER_ADMIN can directly update org id.
		// in all other cases this field is updated through creating org
		// allowApiUpdate: [Role.SUPER_ADMIN],
	})
	organizationId = ''
	@Relations.toOne<User, Organization>(() => Organization, {
		field: 'organizationId',
	})
	organization?: Organization

	@Fields.string<User>({
		allowApiUpdate: [Role.SUPER_ADMIN, Role.ADMIN],
		saving: (user, fieldRef) => {
			if (user.locationId !== fieldRef.originalValue && !user.location) {
				// if no user.location - it means the remult couldn't find
				// a location using the provided locationId, and the location
				// for the update was invalid
				throw new Error('Invalid location')
			}
		},
	})
	locationId = ''
	@Relations.toOne<User, Location>(() => Location, {
		field: 'locationId',
	})
	location?: Location

	@Fields.object({
		allowApiUpdate: [Role.SUPER_ADMIN, Role.ADMIN],
		validate: (user) => {
			if (user.role !== Role.ADMIN && user.role !== Role.USER) {
				console.warn(
					`User ${remult.user?.email} trying to update to illegal role`,
					user
				)
				throw new Error(`Bad action. user:${remult.user?.email}`)
			}
		},
	})
	role = Role.USER

	@Fields.string()
	phone = ''

	@Fields.string<User>({
		validate: (v) => {
			if (v.firstName.length < 3) {
				throw new Error('First name must be at least 3 characters long')
			}
		},
	})
	firstName = ''

	@Fields.string()
	lastName = ''

	// @Relations.toMany(() => AttributeXUser, 'userId')
	// attributes?: AttributeXUser[]

	@Fields.json<User>({
		// validate: (row) => {
		// 	if (row) {
		// 		throw new Error('Need to select at least 1')
		// 	}
		// },
		select: {
			options: DAYS.map((d) => ({ id: d, label: d.toUpperCase() })),
			multiple: true,
			// type: 'select',
		},
		caption: 'Available Days',
	})
	availableDays = []

	@Fields.integer<User>({
		// validate: (row) => {
		// 	if (row.workingHoursStart === 1) {
		// 		throw new Error('Working hours start cannot be 1:00 HR')
		// 	}
		// },
		select: {
			options: WORKING_HOURS.map((d) => ({
				id: d,
				label: d.toString() + ':00 HR',
			})),
			// type: 'select',
		},
		caption: 'Working Hours Start',
	})
	workingHoursStart: HourInDay = 0

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
		hideOnCreate: true,
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
		hideOnCreate: true,
		saving: (row) => (row.updatedBy = remult.user!.email),
	})
	updatedBy = ''
}
