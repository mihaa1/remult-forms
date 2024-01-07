/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import {
	MaterialReactTable,
	useMaterialReactTable,
	type MRT_ColumnDef,
	type MRT_ColumnFiltersState,
	type MRT_PaginationState,
	type MRT_SortingState,
	MRT_Row,
	MRT_TableOptions,
	MRT_RowData,
	createRow,
} from 'material-react-table'
import { EntityMetaDisplay, UI_LIB } from '../types'
import { FieldMetadata, remult } from 'remult'
import { RelationInfo, getRelationInfo } from 'remult/internals'
import {
	getFieldType,
	isHideField,
	isRequired,
	loadRelations,
} from '../utils/general'
import UTILS from '../utils'
import { IconButton, Tooltip, Box, Button } from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import DeleteRowDialog from '../components/grid/DeleteRowDialog'
import useToggle from '../hooks/useToggle'
import RemultCheckbox from '../components/Checkbox'
import RemultAutocomplete from '../components/Autocomplete'

// type UserApiResponse = {
// 	data: Array<User>
// 	meta: {
// 		totalRowCount: number
// 	}
// }

// type User = {
// 	firstName: string
// 	lastName: string
// 	address: string
// 	state: string
// 	phoneNumber: string
// }

interface RemultGridP {
	/** Custom grid title */
	title?: string
	/** Native grid props. These are passed to the grid component as is */
	// gridOptions?: {
	// 	editMode?: 'row' | 'cell'
	// 	checkboxSelection?: boolean
	// 	disableRowSelectionOnClick?: boolean
	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 	[key: string]: any
	// }
}

const RemultGridMRT = <T extends MRT_RowData>({
	entity,
	repo: repoExternal,
	showId,
	showCreatedAt,
	showUpdatedAt,
	// title,
	fieldsToShow = [],
}: // gridOptions,
RemultGridP & EntityMetaDisplay<T>) => {
	const uiLib: UI_LIB = 'mrt'
	const repo = entity ? remult.repo(entity) : repoExternal
	//data and fetching state
	const [data, setData] = useState<T[]>([])
	const [isError, setIsError] = useState(false)
	// const [isLoading, setIsLoading] = useState(false)
	const [isRefetching, setIsRefetching] = useState(false)
	const [rowCount, setRowCount] = useState(0)

	// table state
	const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
	// const [globalFilter, setGlobalFilter] = useState('')
	const [sorting, setSorting] = useState<MRT_SortingState>([])
	const [pagination, setPagination] = useState<MRT_PaginationState>({
		pageIndex: 0,
		pageSize: 5,
	})
	const showDeleteRowDialogToggle: any = useToggle({
		isOpen: false,
	})
	const [selectedRowsForAction, setSelectedRowsForAction] = useState<string[]>(
		[]
	)
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({})
	const [relations, setRelations] = useState<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[k in keyof Partial<T>]?: any[]
	}>({})
	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		columnFilters, //re-fetch when column filters change
		// globalFilter, //re-fetch when global filter changes
		pagination.pageIndex, //re-fetch when page index changes
		pagination.pageSize, //re-fetch when page size changes
		sorting, //re-fetch when sorting changes
	])

	useEffect(() => {
		loadRelations(repo?.fields, fieldsToShow)
			.then(setRelations)
			.catch((e) => console.error('Error loading relations', e))
	}, [repo?.fields])

	const buildOptions = () => {
		const where: any = {}
		for (const cf of columnFilters) {
			where[cf.id] = { [UTILS(uiLib).getOperator('contains')]: cf.value }
		}
		return { where, limit: pagination.pageSize, page: pagination.pageIndex }
	}

	const getValueOptions = <T,>(
		f: FieldMetadata<string, T>,
		relationInfo: RelationInfo
	) => {
		if (f.options.select) {
			return f.options.select?.options
		} else if (relationInfo) {
			const relatedEntities = relations[f.key]
			if (!relatedEntities) {
				return []
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return relatedEntities.map((e: any) => ({
				id: e.id,
				label: e.name || e.id,
			}))
		}
	}

	const columns = useMemo<MRT_ColumnDef<T>[]>(() => {
		return repo?.fields
			?.toArray()
			.slice()
			.sort((a, b) => {
				if (fieldsToShow?.length) {
					if (fieldsToShow.indexOf(a.key) === -1) {
						return 1
					}
					if (fieldsToShow.indexOf(b.key) === -1) {
						return -1
					}
					return fieldsToShow.indexOf(a.key) - fieldsToShow.indexOf(b.key)
				} else {
					return 0
				}
			})
			.map((f: FieldMetadata<any, T>) => {
				if (
					isHideField(
						f,
						repo.fields.toArray(),
						true,
						showId,
						showCreatedAt,
						showUpdatedAt,
						fieldsToShow
					)
				) {
					return
				}
				// const relationInfo = getRelationInfo(f.options)
				const relationInfo = getRelationInfo(f.options)

				const res: MRT_ColumnDef<T> = {
					// accessorKey: relationInfo ? f.options.field : f.key,
					accessorKey: f.key,
					header: f.caption || f.key,
					enableEditing: remult.isAllowedForInstance(
						undefined,
						f.options.allowApiUpdate
					),
					// filterVariant: f.inputType || 'text',
					// type: getFieldType(f),
					// muiEditTextFieldProps: {
					// 	type: f.inputType || 'text',
					// 	// type: 'text',
					// 	required: !!isRequired(f),
					// 	// error: true,
					// 	error: !!validationErrors[f.key],
					// 	helperText: validationErrors[f.key],
					// 	// //remove any previous validation errors when user focuses on the input
					// 	// onFocus: () =>
					// 	//   setValidationErrors({
					// 	//     ...validationErrors,
					// 	//     firstName: undefined,
					// 	//   }),
					// 	// optionally add validation checking for onBlur or onChange
					// },
				}
				if (getFieldType(f) === 'boolean') {
					res.Cell = res.Edit = ({ cell }) => (
						<RemultCheckbox
							checked={cell.getValue<boolean>()}
							onChange={async (e) => {
								// @ts-expect-error TODO: what do u want from me...
								await repo.update(cell.row.id, { [f.key]: e.target.checked })
								await fetchData()
							}}
						/>
					)
				} else if (getFieldType(f) === 'singleSelect') {
					res.Cell = ({ cell, row }) => {
						if (relationInfo) {
							const relatedEntities = relations[f.key]
							if (!relatedEntities) {
								return <></>
							}
							// @ts-expect-error TODO: kill me...
							const selectedRelationId = row.original[f.options.field]
							const selected = relatedEntities.find(
								(re) => re.id === selectedRelationId
							)
							return <Box>{selected?.name || selectedRelationId}</Box>
						} else {
							return <Box>{cell.getValue<string>()}</Box>
						}
					}
					res.Edit = ({ row, table }) => (
						<RemultAutocomplete
							options={getValueOptions(f, relationInfo) || []}
							onSelect={async (newVal) => {
								console.log(f.key, 'newVal', newVal)
								console.log('table', table)
								console.log('table.getState()', table.getState())
								// @ts-expect-error TODO: kill me...
								const key = relationInfo ? f.options.field : f.key
								if (table.getState().creatingRow) {
									console.log('newVal', newVal)
									console.log('key', key)
									console.log('relationInfo', relationInfo)
									// table.setCreatingRow({
									// 	...table.getState().creatingRow,
									// 	[key]: relationInfo ? { id: newVal } : newVal,
									// })
								} else {
									// @ts-expect-error TODO: kill me...
									await repo.update(row.id, { [key]: newVal })
									await fetchData()
								}
							}}
							selectedId={
								// @ts-expect-error TODO: kill me...
								row.original[relationInfo ? f.options.field : f.key]
							}
						/>
					)
				} else {
					res.muiEditTextFieldProps = {
						type: f.inputType || 'text',
						// type: 'text',
						required: !!isRequired(f),
						// error: true,
						error: !!validationErrors[f.key],
						helperText: validationErrors[f.key],
						// //remove any previous validation errors when user focuses on the input
						// onFocus: () =>
						//   setValidationErrors({
						//     ...validationErrors,
						//     firstName: undefined,
						//   }),
						// optionally add validation checking for onBlur or onChange
					}
				}
				return res
			})
			.filter((col) => !!col) as MRT_ColumnDef<T>[]
	}, [
		repo,
		repo?.fields,
		showCreatedAt,
		showId,
		showUpdatedAt,
		validationErrors,
		relations,
	])

	const openDeleteConfirmModal = <T extends MRT_RowData>(
		rows: MRT_Row<T>[]
	) => {
		setSelectedRowsForAction([...rows.map((r) => r.id)])
		showDeleteRowDialogToggle.show()
	}

	const onDeleteConfirm = async () => {
		// @ts-expect-error // [ ] TODO: fix type error here
		const deletePromises = selectedRowsForAction.map((id) => repo.delete(id))
		await Promise.all(deletePromises)
		await fetchData()
		setSelectedRowsForAction([])
		showDeleteRowDialogToggle.close({ title: '', text: '' })
	}

	// const columns1 = useMemo<MRT_ColumnDef<T>[]>(
	// 	() => [
	// 		{
	// 			accessorKey: 'id',
	// 			header: 'Id',
	// 			enableEditing: false,
	// 			size: 80,
	// 			editVariant: 'text',
	// 		},
	// 		{
	// 			accessorKey: 'firstName',
	// 			header: 'First Name',
	// 			muiEditTextFieldProps: {
	// 				type: 'email',
	// 				required: true,
	// 				// error: !!validationErrors?.firstName,
	// 				// helperText: validationErrors?.firstName,
	// 				// //remove any previous validation errors when user focuses on the input
	// 				// onFocus: () =>
	// 				//   setValidationErrors({
	// 				//     ...validationErrors,
	// 				//     firstName: undefined,
	// 				//   }),
	// 				// optionally add validation checking for onBlur or onChange
	// 			},
	// 		},
	// 	],
	// 	[]
	// )

	const onCreate: MRT_TableOptions<T>['onCreatingRowSave'] = async ({
		values,
		table,
	}) => {
		console.log('values', values)
		console.log('xxx table', table)
		console.log('xxx table.getState()', table.getState())
		setValidationErrors({})
		try {
			// @ts-expect-error TODO: fix type error here
			await repo?.insert(values)
			table.setCreatingRow(null)
			await fetchData()
		} catch (e: any) {
			console.error('Error saving row', e)
			if (e.modelState) {
				setValidationErrors({ ...e.modelState })
			}
		}
	}

	const onEdit: MRT_TableOptions<T>['onEditingRowSave'] = async ({
		values,
		table,
	}) => {
		setValidationErrors({})
		try {
			// @ts-expect-error TODO: fix type error here
			await repo?.save(values)
			table.setEditingRow(null) // exit editing mode
		} catch (e: any) {
			console.error('Error saving row', e)
			if (e.modelState) {
				setValidationErrors({ ...e.modelState })
			}
		}
	}

	const table = useMaterialReactTable({
		enableGlobalFilter: false,
		columns,
		data,
		enableRowSelection: true,
		// checkBoxSelection: false,
		getRowId: (row) => row.id,
		initialState: { showColumnFilters: true },
		manualFiltering: true,
		manualPagination: true,
		manualSorting: true,
		muiToolbarAlertBannerProps: isError
			? {
					color: 'error',
					children: 'Error loading data',
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  }
			: undefined,
		onColumnFiltersChange: setColumnFilters,
		// onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		rowCount,
		state: {
			columnFilters,
			// globalFilter, // TODO: search with global filter on all text fields
			// isLoading,
			pagination,
			// showAlertBanner: isError,
			showProgressBars: isRefetching,
			sorting,
		},
		muiSearchTextFieldProps: {
			size: 'small',
			variant: 'outlined',
		},
		createDisplayMode: 'row',
		editDisplayMode: 'row',
		enableEditing: true,
		onCreatingRowSave: onCreate,
		onCreatingRowCancel: () => setValidationErrors({}),
		onEditingRowSave: onEdit,
		onEditingRowCancel: () => setValidationErrors({}),
		renderTopToolbar: ({ table }) => {
			return (
				<Box>
					<Button
						variant='contained'
						onClick={() => {
							table.setCreatingRow(createRow(table, repo?.create()))
						}}
					>
						Add +
					</Button>
					{table.getSelectedRowModel().flatRows.length ? (
						<Button
							sx={{ ml: 1, bgcolor: 'error.main' }}
							variant='contained'
							onClick={() => {
								openDeleteConfirmModal(table.getSelectedRowModel().flatRows)
							}}
						>
							Delete Selected
						</Button>
					) : (
						<></>
					)}
				</Box>
			)
		},
		renderRowActions: ({ row, table }) => (
			<Box sx={{ display: 'flex', gap: '1rem' }}>
				<Tooltip title='Edit'>
					<IconButton onClick={() => table.setEditingRow(row)}>
						<EditIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title='Delete'>
					<IconButton
						color='error'
						onClick={() => openDeleteConfirmModal([row])}
					>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			</Box>
		),
	})

	const fetchData = async () => {
		const findOptions = buildOptions()
		// setIsLoading(true)
		setIsRefetching(true)
		try {
			const count = await repo?.count(findOptions.where)
			const data = await repo?.find({
				...findOptions,
				page: (findOptions.page || 0) + 1,
			})
			setData(data || [])
			setRowCount(count || 0)
		} catch (e) {
			console.error('Error fetching data', e)
			setIsError(true)
		} finally {
			// setIsLoading(false)
			setIsRefetching(false)
			setIsError(false)
		}
	}

	return (
		<div>
			<DeleteRowDialog
				toggle={showDeleteRowDialogToggle}
				onDeleteConfirm={onDeleteConfirm}
			/>
			<MaterialReactTable table={table} />
		</div>
	)
}
export default RemultGridMRT
