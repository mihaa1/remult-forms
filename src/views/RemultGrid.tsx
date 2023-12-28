import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import type { EntityMetaDisplay } from '../types'
import { useEffect, useState } from 'react'
import { remult } from 'remult'
import type { FieldMetadata, FieldsMetadata } from 'remult'
import { getFieldType, isHideField, isMetaActionBlocked } from '../util'
import { Button, Dialog, DialogTitle, Typography } from '@mui/material'
import { RelationInfo, getRelationInfo } from 'remult/internals'
import { Box } from '@mui/system'

interface RemultGridP {
	/** Custom grid title */
	title?: string
	/** Native grid props. These are passed to the grid component as is*/
	gridOptions?: {
		editMode?: 'row' | 'cell'
		checkboxSelection?: boolean
		disableRowSelectionOnClick?: boolean
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any
	}
}

export const RemultGrid = <T,>({
	entity,
	showId,
	showCreatedAt,
	showUpdatedAt,
	title,
	showPartial,
	hidePartial,
	sort = [],
	gridOptions = {
		editMode: 'row',
		checkboxSelection: true,
		disableRowSelectionOnClick: false,
	},
}: RemultGridP & EntityMetaDisplay<T>) => {
	const repo = remult.repo(entity)
	const [data, setData] = useState<T[]>()
	const [relations, setRelations] = useState<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[k in keyof Partial<T>]?: any[]
	}>({})

	const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
	const [confirmationDialog, setShowConfirmation] = useState({
		show: false,
		title: '',
		text: '',
	})

	useEffect(() => {
		fetchDate()
	}, [repo])

	useEffect(() => {
		loadRelations(repo.fields)
	}, [repo.fields])

	const fetchDate = async () => {
		await repo.find().then(setData)
	}

	const loadRelations = async (fields: FieldsMetadata<T>) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const res: any = {}
		for (const f of fields.toArray()) {
			if (hidePartial && hidePartial.indexOf(f.key as keyof T) !== -1) {
				continue
			}
			const relationInfo = getRelationInfo(f.options)
			if (relationInfo) {
				const relatedEntities = await remult.repo(relationInfo.toType()).find()
				res[f.key] = relatedEntities
			}
		}
		setRelations({ ...res })
		// setRelations((prev) => ({ ...prev, ...res }))
	}

	const getValueOptions = <T,>(
		f: FieldMetadata<string, T>,
		relationInfo: RelationInfo
	) => {
		if (f.options.select) {
			return f.options.select?.options.map((o) => ({
				value: o.id,
				label: o.label,
			}))
		} else if (relationInfo) {
			// @ts-expect-error TODO: fix type error here
			const relatedEntities = relations[f.key]
			if (!relatedEntities) {
				return []
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return relatedEntities.map((e: any) => ({
				value: e.id,
				label: e.name || e.id,
			}))
		}
	}

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
				const relationInfo = getRelationInfo(f.options)
				return {
					// @ts-expect-error TODO: fix type error here
					field: relationInfo ? f.options.field : f.key,
					headerName: f.caption || f.key,
					width: 120,
					editable: !isMetaActionBlocked(f.options.allowApiUpdate),
					type: getFieldType(f),
					valueOptions: getValueOptions(f, relationInfo),
				}
			})
			.filter((col) => !!col) as GridColDef[]
	}

	const onDelete = () =>
		setShowConfirmation({
			show: true,
			title: 'Are you sure you want to delete these items?',
			text: 'This action cannot be undone.',
		})

	const onDeleteConfirm = async () => {
		// @ts-expect-error // [ ] TODO: fix type error here
		const deletePromises = selectedRows.map((id) => repo.delete(id))
		await Promise.all(deletePromises)
		await fetchDate()
		resetConfirm()
	}

	const resetConfirm = () =>
		setShowConfirmation({ show: false, title: '', text: '' })

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<Dialog open={confirmationDialog.show}>
				<Box
					sx={{
						pb: 2,
					}}
				>
					<DialogTitle>{confirmationDialog.title}</DialogTitle>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Typography sx={{ mb: 3 }}>{confirmationDialog.text}</Typography>
						<Box>
							<Button sx={{ mr: 3 }} onClick={resetConfirm}>
								Dismiss
							</Button>
							<Button
								sx={{ bgcolor: 'error.main' }}
								variant='contained'
								onClick={onDeleteConfirm}
							>
								Delete
							</Button>
						</Box>
					</Box>
				</Box>
			</Dialog>
			<Typography sx={{ mb: 1 }}>{title || repo.metadata.caption}</Typography>
			{data && (
				<>
					{selectedRows?.length ? (
						<Button variant='contained' onClick={onDelete}>
							Delete
						</Button>
					) : (
						<></>
					)}
					<DataGrid
						{...gridOptions}
						columns={getColumnsMetadata(repo.fields)}
						rows={data}
						slots={{ toolbar: GridToolbar }}
						// loading
						processRowUpdate={async (newRow) => await repo.save(newRow)}
						onProcessRowUpdateError={(e) => {
							console.error('e', e)
						}}
						onRowSelectionModelChange={(selected) => setSelectedRows(selected)}
					/>
				</>
			)}
		</div>
	)
}
