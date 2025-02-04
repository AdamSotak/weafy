import express from 'express'
import dotenv from 'dotenv'
import devicesRouter from './api/devicesRouter'
import egressRouter from './api/egressRouter'
import ingressRouter from './api/ingressRouter'
import { verifyApiKey } from './middleware/authMiddleware'
import chatRouter from './api/chatRouter'
import mlRouter from './api/mlRouter'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001;

app.use(express.json())

app.use(verifyApiKey)

app.use('/api/devices', devicesRouter)
app.use('/api/egress', egressRouter)
app.use('/api/ingress', ingressRouter)
app.use('/api/chat', chatRouter)
app.use('/api/ml', mlRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})