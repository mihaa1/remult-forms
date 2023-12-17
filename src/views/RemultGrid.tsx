import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import type { ClassType } from '../types'
import { useEffect, useState } from 'react'
import { useDemoData } from '@mui/x-data-grid-generator'
import { remult } from 'remult'

interface RemultTableP<T> {
	/** Model to generate form for */
	entity: ClassType<T>
	/** Show item id */
	showId?: boolean
	/** Custom form title */
	title?: string
	/** Trigger on form submit. This will pass the created/edited item and will NOT perform the action. */
	onSubmit?: (item: T | undefined) => void
	/** Trigger on action completed. When create/edit action is done this will be fired */
	onDone?: (item: T[] | undefined) => void
}
const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin']

export const RemultGrid = <T,>({
	entity,
}: // showId,
// title,
// onSubmit,
// onDone,
RemultTableP<T>) => {
	const repo = remult.repo(entity)
	const [data, setData] = useState<T[]>()
	const { data: exampleData } = useDemoData({
		dataSet: 'Employee',
		visibleFields: VISIBLE_FIELDS,
		rowLength: 100,
	})

	console.log('entity', entity)
	console.log('exampleData', exampleData)
	console.log('repo', repo)
	useEffect(() => {
		remult.repo(entity).find().then(setData)
	}, [])

	const transformToFields = () => {
		return repo.fields.toArray().map((f) => {
			return {
				field: f.key,
			}
		})
	}

	return (
		<div style={{ height: '100%', width: '100%' }}>
			{data && (
				<DataGrid
					columns={transformToFields()}
					// @ts-expect-error TODO: fix this
					rows={data}
					slots={{ toolbar: GridToolbar }}
				/>
			)}
		</div>
	)
}
