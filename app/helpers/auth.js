const jwt = require('jsonwebtoken')
require('dotenv').config()
const constants = require('../constants')

module.exports =
   (permissions = []) =>
   async (req, res, next) => {
      let message = 'Unauthorized'
      let status = constants.errorCodes.UNAUTHENTICATED
      try {
         const {
            headers: { authorization },
         } = req
         if (!authorization) {
            throw new Error('')
         }
         const [, token] = authorization.split(' ')
         const decodedToken = jwt.verify(token, process.env.SECRET)
         const { customer_xid } = decodedToken

         if (!customer_xid) {
            throw new Error('')
         }
         next()
      } catch (err) {
         return res.status(400).json({
            code: 400,
            status,
            message,
         })
      }
   }
