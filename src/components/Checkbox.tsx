import { Checkbox, FormControlLabel } from '@mui/material'
import { ChangeEvent } from 'react'

interface RemultCheckboxP {
	checked: boolean
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	label?: string
	disabled?: boolean
}
const RemultCheckbox = ({
	checked: val,
	onChange,
	label,
	disabled,
}: RemultCheckboxP) => {
	return (
		<FormControlLabel
			control={
				<Checkbox checked={val} onChange={onChange} disabled={disabled} />
			}
			label={label}
		/>
	)
}

export default RemultCheckbox
