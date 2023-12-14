import { Allow, Entity, Fields } from 'remult'

@Entity<Organization>('organization', {
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
export class Organization {
	@Fields.cuid()
	id = ''

	@Fields.string()
	name = ''
}
