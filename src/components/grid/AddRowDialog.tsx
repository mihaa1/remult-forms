import { Dialog, DialogTitle, IconButton } from '@mui/material'
import { RemultForm } from '../../RemultFormMUI/RemultFormMUI'
import { Repository } from 'remult'
import { Box } from '@mui/system'
import { Close } from '@mui/icons-material'
import { ModalToggle } from '../../hooks/useToggle'

interface AddRowDialogP<T> {
	repo?: Repository<T>
	toggle: ModalToggle
	onAddRow: () => void
}

const AddRowDialog = <T,>({ repo, toggle, onAddRow }: AddRowDialogP<T>) => {
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
				{/* @ts-expect-error dunno what to do with this */}
				<RemultForm title=' ' repo={repo} onDone={onAddRow} />
			</Box>
		</Dialog>
	)
}

export default AddRowDialog
