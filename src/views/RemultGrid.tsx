/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import type {
	GridColDef,
	GridEditMode,
	GridRowModel,
	GridRowSelectionModel,
	GridValidRowModel,
} from '@mui/x-data-grid'
import type { EntityMetaDisplay, UI_LIB } from '../types'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { remult } from 'remult'
import type { FieldMetadata, FieldsMetadata, FindOptions } from 'remult'
import {
	getFieldType,
	isHideField,
	isMetaActionBlocked,
	loadRelations,
} from '../util'
import {
	Alert,
	AlertProps,
	Button,
	LinearProgress,
	Snackbar,
	Typography,
} from '@mui/material'
import { RelationInfo, getRelationInfo } from 'remult/internals'
import { Box } from '@mui/system'
import AddRowDialog from '../components/grid/AddRowDialog'
import useToggle from '../hooks/useToggle'
import DeleteRowDialog from '../components/grid/DeleteRowDialog'
import utils from '../utils'
import { MuiFilterOperator } from '../utils/mui_v5.util'
import { UILibContext } from '../UILibContext'
// TODO: there is an option to enter edit mode with 1 click.
// See here: https://mui.com/x/react-data-grid/recipes-editing/#single-click-editing
interface RemultGridP {
	/** Custom grid title */
	title?: string
	/** Native grid props. These are passed to the grid component as is */
	gridOptions?: {
		editMode?: 'row' | 'cell'
		checkboxSelection?: boolean
		disableRowSelectionOnClick?: boolean
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any
	}
	uiLib?: UI_LIB
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
	fieldsToShow = [],
	gridOptions,
	uiLib = 'mui_v5',
}: RemultGridP & EntityMetaDisplay<T>): ReactNode => {
	const repo = entity ? remult.repo(entity) : repoExternal

	const [data, setData] = useState<T[]>()
	const [relations, setRelations] = useState<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[k in keyof Partial<T>]?: any[]
	}>({})

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [options, setOptions] = useState<FindOptions<any>>({
		limit: 5,
		page: 0,
	})

	const [rowCountState, setRowCountState] = useState(0)
	const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
	const [gridOptionsMerged, setGridOptionsMerged] = useState({
		...GRID_OPTIONS_DEFAULTS,
	})

	const [snackbar, setSnackbar] = useState<Pick<
		AlertProps,
		'children' | 'severity'
	> | null>(null)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const showDeleteRowDialogToggle: any = useToggle({
		isOpen: false,
		title: '',
		text: '',
	})
	const showAddRowDialogToggle = useToggle()

	useEffect(() => {
		fetchData(options)
		return repo
			?.liveQuery({
				...options,
				page: (options.page || 0) + 1,
			})
			.subscribe((info) => setData(info.applyChanges))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [repo, options])

	useEffect(() => {
		loadRelations(repo?.fields, fieldsToShow)
			.then(setRelations)
			.catch((e) => console.error('Error loading relations', e))
	}, [repo])

	useEffect(() => {
		setGridOptionsMerged({ ...GRID_OPTIONS_DEFAULTS, ...gridOptions })
	}, [gridOptions])

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fetchData = async (findOptions: FindOptions<any>) => {
		const count = await repo?.count(findOptions.where)
		// const data = await repo?.find({
		// 	...findOptions,
		// 	page: (findOptions.page || 0) + 1,
		// })
		// setData(data)
		setRowCountState(count || 0)
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

	const columns = (fields: FieldsMetadata<T> | undefined): GridColDef[] => {
		return (
			fields
				?.toArray()
				.slice()
				// .sort((a, b) => {
				// 	if (showId && a.key === 'id') {
				// 		return -1
				// 	}
				// 	if (showId && b.key === 'id') {
				// 		return 1
				// 	}
				// 	return a.key > b.key ? 1 : -1
				// })
				.sort((a, b) => {
					if (showId && a.key === 'id') {
						return -1
					}
					if (showId && b.key === 'id') {
						return 1
					}
					if (fieldsToShow?.length) {
						// @ts-expect-error TODO: fix type error here
						if (fieldsToShow.indexOf(a.key) === -1) {
							return 1
						}
						// @ts-expect-error TODO: fix type error here
						if (fieldsToShow.indexOf(b.key) === -1) {
							return -1
						}
						// @ts-expect-error TODO: fix type error here
						return fieldsToShow.indexOf(a.key) - fieldsToShow.indexOf(b.key)
					} else {
						return a.key > b.key ? 1 : -1
					}
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
							fieldsToShow
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
						// preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
						// 	console.log('>>> params', params)
						// 	// const hasError = params.props.value.length < 3;
						// 	return { ...params.props, error: true }
						// },
					}
				})
				.filter((col) => !!col) as GridColDef[]
		)
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onEdit = async (newRow: GridRowModel, _oldRow: GridRowModel) => {
		const res = await repo?.save(newRow as T)
		setSnackbar({
			children: `${repo?.metadata.caption} successfully saved`,
			severity: 'success',
		})
		await fetchData(options)
		return res
	}

	const onEditError = useCallback((error: Error) => {
		setSnackbar({ children: error.message, severity: 'error' })
	}, [])

	return (
		<UILibContext.Provider value={uiLib}>
			<div style={{ height: '100%', width: '100%' }}>
				<AddRowDialog
					repo={repo}
					toggle={showAddRowDialogToggle}
					onAddRow={async () => {
						showAddRowDialogToggle.close()
						await fetchData(options)
					}}
				/>
				<DeleteRowDialog
					toggle={showDeleteRowDialogToggle}
					onDeleteConfirm={onDeleteConfirm}
				/>
				{!!snackbar && (
					<Snackbar
						open
						anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
						onClose={() => setSnackbar(null)}
						autoHideDuration={5000}
					>
						<Alert {...snackbar} onClose={() => setSnackbar(null)} />
					</Snackbar>
				)}
				<Typography sx={{ mb: 1 }}>
					{title || repo?.metadata.caption}
				</Typography>
				{data && (
					<>
						{renderActions()}
						<DataGrid
							{...gridOptionsMerged}
							columns={columns(repo?.fields)}
							rows={data as GridValidRowModel[]}
							slots={{
								toolbar: GridToolbar,
								loadingOverlay: LinearProgress,
							}}
							// loading
							// processRowUpdate={async (newRow) => await repo?.save(newRow)}
							processRowUpdate={onEdit}
							onProcessRowUpdateError={onEditError}
							onRowSelectionModelChange={setSelectedRows}
							onPaginationModelChange={(model) => {
								setOptions({
									...options,
									limit: model.pageSize,
									page: model.page,
								})
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
							filterMode='server'
							onFilterModelChange={(model) => {
								if (
									model.items[0].value === undefined ||
									(Array.isArray(model.items[0].value) &&
										!model.items[0].value.length)
								) {
									return setOptions({
										limit: options.limit,
										page: options.page,
									})
								}
								setOptions({
									...options,
									where: {
										[model.items[0].field]: {
											[utils(uiLib)!.getOperator(
												model.items[0].operator as MuiFilterOperator
											)]:
												model.items[0].operator === 'equals' ||
												model.items[0].operator === 'is'
													? [model.items[0].value]
													: model.items[0].value,
										},
									},
								})
							}}
						/>
					</>
				)}
			</div>
		</UILibContext.Provider>
	)
}
