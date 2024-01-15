const jwt = require('jsonwebtoken')

module.exports = (headers) => {
   const { authorization } = headers
   const [, token] = authorization.split(' ')
   const decodedToken = jwt.verify(token, process.env.SECRET)
   const { customer_xid } = decodedToken
   return customer_xid
}
