import { ModalToggle } from '../../hooks/useToggle'
import { Button, Dialog, DialogTitle, Typography } from '@mui/material'
import { Box } from '@mui/system'

interface DeleteRowDialogP {
	toggle: ModalToggle
	onDeleteConfirm: () => void
}

const DeleteRowDialog = ({ toggle, onDeleteConfirm }: DeleteRowDialogP) => {
	return (
		<Dialog open={toggle.isOpen}>
			<Box
				sx={{
					pb: 2,
				}}
			>
				<DialogTitle>Are you sure you want to delete these items?</DialogTitle>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Typography sx={{ mb: 3 }}>This action cannot be undone.</Typography>
					<Box>
						<Button sx={{ mr: 3 }} onClick={toggle.close}>
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
	)
}

export default DeleteRowDialog
