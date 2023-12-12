// import { useEffect } from 'react'
import { remult } from 'remult'
import { TextField } from '@mui/material'

type ClassType<T> = {
	new (...args: any[]): T // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const RemultForm = <T,>({ entity }: { entity: ClassType<T> }) => {
	// export const RemultForm = <T,>(repo: Repository<T>) => {
	// console.log('entity', entity)
	const repo = remult.repo(entity)
	console.log('repo', repo)
	console.log('repo.fields', repo.fields)
	console.log('repo.metadata', repo.metadata)
	console.log('repo.metadata.columnsInfo', repo.metadata.columnsInfo)

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			{/* @ts-expect-error longer */}
			{repo.metadata.columnsInfo.map((c) => {
				return (
					<TextField
						key={`${c.key}`}
						label={c.caption || c.key}
						disabled={c.allowApiUpdate === false}
					/>
				)
			})}
		</div>
	)
}
