import express, { Request, Response } from 'express'
import { api } from './api'

const app = express()

app.use('/hello', (req: Request, res: Response) => {
	console.log('req.url', req.url)
	res.send('ok')
})

app.use(api)

app.listen(process.env['PORT'] || 3003, () => console.log('Server started'))
