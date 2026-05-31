import express from 'express'
import { calculatePayroll } from './payroll'

const app = express()
app.use(express.json())

app.post('/calculate', (req, res) => {
    const result = calculatePayroll(req.body)
    res.json(result)
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})