import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'
import type { EntityMetaDisplay } from '../types'
import { useEffect, useState } from 'react'
import { FieldsMetadata, remult } from 'remult'
import { getFieldType, isHideField, isMetaActionBlocked } from '../util'
import { Typography } from '@mui/material'

interface RemultGridP {
	/** Custom grid title */
	title?: string
}
// const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin']

export const RemultGrid = <T,>({
	entity,
	showId,
	showCreatedAt,
	showUpdatedAt,
	title,
	showPartial,
	hidePartial,
	sort = [],
}: RemultGridP & EntityMetaDisplay<T>) => {
	const repo = remult.repo(entity)
	const [data, setData] = useState<T[]>()
	const [columns, setColumns] = useState<GridColDef[]>([])

	useEffect(() => {
		setColumns(getColumnsMetadata(repo.fields))
	}, [repo.fields])

	useEffect(() => {
		repo.find().then(setData)
	}, [repo])

	const getColumnsMetadata = (fields: FieldsMetadata<T>): GridColDef[] => {
		return fields
			.toArray()
			.slice()
			.sort((a, b) => (a.key > b.key ? 1 : -1))
			.sort((a, b) => {
				// @ts-expect-error TODO: fix type error here
				if (sort.indexOf(a.key) === -1) {
					return 1
				}
				// @ts-expect-error TODO: fix type error here
				if (sort.indexOf(b.key) === -1) {
					return -1
				}
				// @ts-expect-error TODO: fix type error here
				return sort.indexOf(a.key) - sort.indexOf(b.key)
			})
			.map((f) => {
				if (
					isHideField(
						f,
						fields.toArray(),
						true,
						showId,
						showCreatedAt,
						showUpdatedAt,
						showPartial,
						hidePartial
					)
				) {
					return
				}
				return {
					field: f.key,
					headerName: f.key,
					width: 120,
					editable: !isMetaActionBlocked(f.options.allowApiUpdate),
					type: getFieldType(f) || 'string',
				}
			})
			.filter((col) => !!col) as GridColDef[]
	}

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<Typography sx={{ mb: 1 }}>{title || repo.metadata.caption}</Typography>
			{data && (
				<DataGrid
					columns={columns}
					rows={data}
					slots={{ toolbar: GridToolbar }}
				/>
			)}
		</div>
	)
}
