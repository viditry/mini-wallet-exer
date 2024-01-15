const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { wallet, walletTransaction } = require('./app/controllers')
const auth = require('./app/helpers/auth')

const { createWallet, enableWallet, disableWallet, getDetailWallet } = wallet
const { createDeposit, createWithdrawal } = walletTransaction

const port = process.env.PORT || 3000
const app = express()
var router = express.Router()

dotenv.config() // passing data from .env file

// parse application/x-www-form-urlencoded
app.use(
   bodyParser.urlencoded({
      extended: false,
   }),
)
// parse application/json
app.use(
   bodyParser.json({
      type: 'application/json',
   }),
)
// enable cors
app.use(cors())

app.get('/', async (req, res) => {
   res.status(200).json({
      code: 200,
      status: 'success',
      message: 'Welcome to the beginning of nothingness',
   })
})

router.get('/wallet', auth(), getDetailWallet)
router.post('/init', createWallet)
router.post('/wallet', auth(), enableWallet)
router.patch('/wallet', auth(), disableWallet)

router.post('/wallet/withdrawals', auth(), createWithdrawal)
router.post('/wallet/deposits', auth(), createDeposit)

app.use('/api/v1/', router) // read routes from index.js file

const server = app.listen(port, () => {
   console.log(`Server listening on port: ${port}`)
})

module.exports = server
