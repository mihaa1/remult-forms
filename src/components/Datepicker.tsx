import { FieldMetadata } from 'remult'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { isDisabled } from '../util'

interface RemultDatepickerP<T> {
	field: FieldMetadata<any, T> // eslint-disable-line @typescript-eslint/no-explicit-any
	onChange: (e: unknown, key: string) => void
}
const RemultDatepicker = <T,>({ field, onChange }: RemultDatepickerP<T>) => {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DemoContainer components={['DatePicker']}>
				<DatePicker
					label={field.caption}
					onChange={(e) => onChange(e, field.key)}
					disabled={isDisabled(field)}
				/>
			</DemoContainer>
		</LocalizationProvider>
	)
}

export default RemultDatepicker
