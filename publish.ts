import { exec } from 'child_process'

const main = async () => {
	const { version } = await import('./package.json')
	console.log('version', version)
	exec(
		`yarn publish dist/src --new-version ${version}`,
		(err, stdout, stderr) => {
			if (err) {
				console.error(err)
				return
			}
			console.log(stdout)
			console.log(stderr)
		}
	)
}

main()
