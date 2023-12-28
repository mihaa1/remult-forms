import { Dialog, DialogTitle, IconButton } from '@mui/material'
import { RemultForm } from '../../RemultForm'
import { Repository } from 'remult'
import { Box } from '@mui/system'
import { Close } from '@mui/icons-material'
import { ModalToggle } from '../../hooks/useToggle'

interface AddRowDialogP<T> {
	repo?: Repository<T>
	toggle: ModalToggle
}

const AddRowDialog = <T,>({ repo, toggle }: AddRowDialogP<T>) => {
	return (
		<Dialog open={toggle.isOpen}>
			<DialogTitle>Create {repo?.metadata.caption}</DialogTitle>
			<Box sx={{ p: 2 }}>
				<IconButton
					onClick={toggle.close}
					sx={{ position: 'absolute', top: 0, right: 0, ml: 'auto' }}
				>
					<Close />
				</IconButton>
				<RemultForm title=' ' repo={repo} />
			</Box>
		</Dialog>
	)
}

export default AddRowDialog
