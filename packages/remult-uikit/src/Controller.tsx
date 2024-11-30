import { Controller as ControllerInternal } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form'
import { getValidator } from './util'
import { Repository } from 'remult'

type ControllerPropsWithRepo<T> = ControllerProps & {
	repo: Repository<T>
}

const Controller = <T,>(props: ControllerPropsWithRepo<T>) => {
	return (
		<ControllerInternal
			{...props}
			rules={{
				validate: getValidator(props.repo, props.name as keyof T),
			}}
		/>
	)
}
export default Controller
