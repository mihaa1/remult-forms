import { Button } from '@mui/material'
import {
	GridRowSelectionModel,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarExport,
	GridToolbarFilterButton,
	gridRowSelectionStateSelector,
	useGridApiContext,
	useGridSelector,
} from '@mui/x-data-grid'

const CustomToolbar = ({
	onAdd,
	onDelete,
}: {
	onAdd: VoidFunction
	onDelete: (ids: GridRowSelectionModel) => void
}) => {
	const apiRef = useGridApiContext()
	const selectedRows = useGridSelector(apiRef, gridRowSelectionStateSelector)

	return (
		<GridToolbarContainer>
			<GridToolbarColumnsButton />
			<GridToolbarFilterButton />
			<GridToolbarDensitySelector />
			<GridToolbarExport />
			<Button sx={{ ml: 1 }} onClick={onAdd} variant='contained' size='small'>
				Add +
			</Button>
			{selectedRows?.length ? (
				<Button
					sx={{ ml: 1, bgcolor: 'error.main' }}
					variant='contained'
					size='small'
					onClick={() => onDelete(selectedRows)}
				>
					Delete
				</Button>
			) : (
				<></>
			)}
		</GridToolbarContainer>
	)
}
export default CustomToolbar
