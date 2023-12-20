import { useEffect, useState } from 'react'
import RemultCheckbox from './Checkbox'
import { MultipleSelectP } from '../types'
import { Typography } from '@mui/material'
import { useTheme } from '@emotion/react'

interface RemultCheckboxMultipleP {
	row?: boolean
	label?: string
}

const RemultCheckboxMultiple = ({
	options,
	selected,
	onSelect,
	row,
	label,
	disabled,
	error,
}: MultipleSelectP & RemultCheckboxMultipleP) => {
	const [selectedInner, setSelectedInner] = useState(
		selected ? [...selected] : []
	)
	const theme = useTheme()

	useEffect(() => {
		setSelectedInner(selected ? [...selected] : [])
	}, [selected])

	return (
		<>
			<Typography>{label}</Typography>
			<div style={{ display: 'flex', flexDirection: row ? 'row' : 'column' }}>
				{options.map((v) => {
					return (
						<RemultCheckbox
							key={`checkbox_${v.id}`}
							disabled={disabled}
							checked={selected ? !!selected.find((s) => s.id === v.id) : false}
							onChange={(e) => {
								console.log('e', e.target.checked)
								let newVals
								if (e.target.checked) {
									newVals = [...selectedInner, v]
								} else {
									newVals = [...selectedInner.filter((s) => s.id !== v.id)]
								}
								setSelectedInner(newVals)
								onSelect(newVals)
							}}
							label={v.label}
						/>
					)
				})}
			</div>
			{error && (
				// @ts-expect-error TODO: setup theme types correctly
				<Typography color={theme.palette?.error.main}>{error}</Typography>
			)}
		</>
	)
}

export default RemultCheckboxMultiple
