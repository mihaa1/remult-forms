import { useEffect, useState } from 'react'
import RemultCheckbox from './Checkbox'
import { MultiSelectOption } from '../types'

interface RemultCheckboxMultipleP {
	options: MultiSelectOption[]
	selected?: MultiSelectOption[]
	onSelect: (arg: Pick<MultiSelectOption, 'id'>[]) => void
}

const RemultCheckboxMultiple = ({
	options,
	selected,
	onSelect,
}: RemultCheckboxMultipleP) => {
	const [selectedInner, setSelectedInner] = useState(
		selected ? [...selected] : []
	)

	useEffect(() => {
		setSelectedInner(selected ? [...selected] : [])
	}, [selected])

	return options.map((v) => {
		return (
			<RemultCheckbox
				key={`checkbox_${v.id}`}
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
	})
}

export default RemultCheckboxMultiple
