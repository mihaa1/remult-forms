import { useEffect, useState } from 'react'
import RemultCheckbox from './Checkbox'
import { MultipleSelectP } from '../types'

interface RemultCheckboxMultipleP {
	row?: boolean
}

const RemultCheckboxMultiple = ({
	options,
	selected,
	onSelect,
	row,
	disabled,
}: MultipleSelectP & RemultCheckboxMultipleP) => {
	const [selectedInner, setSelectedInner] = useState(
		selected ? [...selected] : []
	)

	useEffect(() => {
		setSelectedInner(selected ? [...selected] : [])
	}, [selected])

	return (
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
	)
}

export default RemultCheckboxMultiple
