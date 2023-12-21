import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { SingleSelectP } from '../types'
import { FormHelperText } from '@mui/material'

interface RemultRadioGroupP {
	row?: boolean
}

const RemultRadioGroup = ({
	options,
	selectedId: selected,
	onSelect,
	disabled,
	label,
	row,
	error,
}: SingleSelectP & RemultRadioGroupP) => {
	return (
		<FormControl disabled={disabled} error={!!error}>
			<FormLabel>{label}</FormLabel>
			<RadioGroup
				row={row}
				value={selected !== undefined && selected !== null ? selected : ''}
				onChange={(_e, val) => onSelect(val)}
			>
				{options.map((o) => {
					return (
						<FormControlLabel
							key={o.id}
							value={o.id}
							control={<Radio />}
							label={o.label}
						/>
					)
				})}
			</RadioGroup>
			<FormHelperText>{error}</FormHelperText>
		</FormControl>
	)
}
export default RemultRadioGroup
