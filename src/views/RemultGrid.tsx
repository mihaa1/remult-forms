import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import type {
	GridColDef,
	GridEditMode,
	GridRowSelectionModel,
} from '@mui/x-data-grid'
import type { EntityMetaDisplay } from '../types'
import { ReactNode, useEffect, useState } from 'react'
import { remult } from 'remult'
import type { FieldMetadata, FieldsMetadata, FindOptions } from 'remult'
import { getFieldType, isHideField, isMetaActionBlocked } from '../util'
import { Button, LinearProgress, Typography } from '@mui/material'
import { RelationInfo, getRelationInfo } from 'remult/internals'
import { Box } from '@mui/system'
import AddRowDialog from '../components/grid/AddRowDialog'
import useToggle from '../hooks/useToggle'
import DeleteRowDialog from '../components/grid/DeleteRowDialog'

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
const GRID_OPTIONS_DEFAULTS = {
	editMode: 'row' as GridEditMode,
	checkboxSelection: true,
	disableRowSelectionOnClick: true,
}

export const RemultGrid = <T,>({
	entity,
	repo: repoExternal,
	showId,
	showCreatedAt,
	showUpdatedAt,
	title,
	showPartial,
	hidePartial,
	sort = [],
	gridOptions,
}: RemultGridP & EntityMetaDisplay<T>): ReactNode => {
	const repo = entity ? remult.repo(entity) : repoExternal

	const [data, setData] = useState<T[]>()
	const [relations, setRelations] = useState<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[k in keyof Partial<T>]?: any[]
	}>({})

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [options, setOptions] = useState<FindOptions<any>>({
		limit: 10,
		page: 0,
	})

	const [rowCountState, setRowCountState] = useState(0)
	const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
	const [gridOptionsMerged, setGridOptionsMerged] = useState({
		...GRID_OPTIONS_DEFAULTS,
	})

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const showDeleteRowDialogToggle: any = useToggle({
		isOpen: false,
		title: '',
		text: '',
	})
	const showAddRowDialogToggle = useToggle()

	useEffect(() => {
		fetchData(options)
	}, [repo, options])

	useEffect(() => {
		loadRelations(repo?.fields)
	}, [repo?.fields])

	useEffect(() => {
		setGridOptionsMerged({ ...GRID_OPTIONS_DEFAULTS, ...gridOptions })
	}, [gridOptions])

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fetchData = async (findOptions: FindOptions<any>) => {
		const count = await repo?.count()
		const data = await repo?.find({
			...findOptions,
			page: (findOptions.page || 0) + 1,
		})
		setData(data)
		setRowCountState(count || 0)
	}

	const loadRelations = async (fields: FieldsMetadata<T> | undefined) => {
		if (!fields) {
			return
		}

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

	const getColumnsMetadata = (
		fields: FieldsMetadata<T> | undefined
	): GridColDef[] => {
		return fields
			?.toArray()
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

	const onDeleteConfirm = async () => {
		// @ts-expect-error // [ ] TODO: fix type error here
		const deletePromises = selectedRows.map((id) => repo.delete(id))
		await Promise.all(deletePromises)
		await fetchData(options)
		resetConfirm()
	}

	const resetConfirm = () =>
		showDeleteRowDialogToggle.close({ title: '', text: '' })

	const toggleOrderBy = (key: string) => {
		let dir = options.orderBy?.[key]
		if (dir === undefined) {
			dir = 'asc'
		} else if (dir === 'asc') {
			dir = 'desc'
		} else {
			dir = undefined
		}
		setOptions({ ...options, orderBy: { [key]: dir } })
	}

	const renderActions = () => {
		return (
			<Box sx={{ mb: 1 }}>
				<Button
					onClick={showAddRowDialogToggle.show}
					variant='contained'
					size='small'
				>
					Add +
				</Button>
				{selectedRows?.length ? (
					<Button
						sx={{ ml: 1, bgcolor: 'error.main' }}
						variant='contained'
						size='small'
						onClick={showDeleteRowDialogToggle.show}
					>
						Delete
					</Button>
				) : (
					<></>
				)}
			</Box>
		)
	}

	return (
		<div style={{ height: '100%', width: '100%' }}>
			{<AddRowDialog repo={repo} toggle={showAddRowDialogToggle} />}
			{
				<DeleteRowDialog
					toggle={showDeleteRowDialogToggle}
					onDeleteConfirm={onDeleteConfirm}
				/>
			}
			<Typography sx={{ mb: 1 }}>{title || repo?.metadata.caption}</Typography>
			{data && (
				<>
					{renderActions()}
					<DataGrid
						{...gridOptionsMerged}
						columns={getColumnsMetadata(repo?.fields)}
						rows={data}
						slots={{
							toolbar: GridToolbar,
							loadingOverlay: LinearProgress,
						}}
						// loading
						processRowUpdate={async (newRow) => await repo?.save(newRow)}
						onProcessRowUpdateError={(e) => {
							console.error('e', e)
						}}
						onRowSelectionModelChange={(selected) => setSelectedRows(selected)}
						onPaginationModelChange={(model) => {
							setOptions({ limit: model.pageSize, page: model.page })
							// fetchData({ limit: model.pageSize, page: model.page })
						}}
						paginationMode='server'
						rowCount={rowCountState}
						pageSizeOptions={[5, 10, 20]}
						paginationModel={{
							pageSize: options.limit || 0,
							page: options.page || 0,
						}}
						onSortModelChange={(model) => {
							toggleOrderBy(model[0].field)
						}}
					/>
				</>
			)}
		</div>
	)
}
