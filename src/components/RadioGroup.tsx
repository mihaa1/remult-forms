import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { SingleSelectP } from '../types'

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
}: SingleSelectP & RemultRadioGroupP) => {
	console.log('>>> selected', selected)
	console.log('>>> options', options)
	return (
		<FormControl disabled={disabled}>
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
		</FormControl>
	)
}
export default RemultRadioGroup
