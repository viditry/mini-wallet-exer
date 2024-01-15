const models = require('../models')
const constants = require('../constants')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const getLogged = require('../helpers/getLogged')
const validateWallet = require('../helpers/validateWallet')

async function getDetailWallet(req, res) {
   const customer_xid = getLogged(req.headers)
   try {
      let wallet = await models.Wallet.findOne({
         where: {
            ownedBy: customer_xid,
         },
      })
      const validateWalletResult = validateWallet(wallet)
      if (!validateWalletResult.success) {
         return res.status(422).json(validateWalletResult)
      }

      return res.status(200).json({
         code: 200,
         status: 'success',
         message: 'detail Wallet',
         data: wallet,
      })
   } catch (error) {
      console.log(error)
      return res.status(400).json({
         code: 400,
         status: constants.errorCodes.INTERNAL_SERVER_ERROR,
         message: 'Internal Server Error',
      })
   }
}

async function createWallet(req, res) {
   const joiValidation = {
      customer_xid: Joi.string().guid().required(),
   }
   const { error } = Joi.validate(req.body, joiValidation)
   if (error) {
      return res.status(422).json({
         status: 'error',
         message: constants.errorCodes.BAD_DATA_VALIDATION,
         error: error.details[0].message,
      })
   }
   try {
      let { customer_xid } = req.body
      let wallet = await models.Wallet.findOne({
         where: {
            ownedBy: customer_xid,
         },
      })
      if (!wallet) {
         wallet = await models.Wallet.create({
            ownedBy: customer_xid,
         })
      }

      let token = jwt.sign(
         {
            customer_xid,
         },
         process.env.SECRET,
         {
            expiresIn: 86400, // expires in 24 hours
         },
      )

      return res.status(200).json({
         status: 'success',
         message: 'token created',
         data: { token },
      })
   } catch (err) {
      // res.status(401).json(error)
      return res.status(400).json({
         status: error,
         error: constants.errorCodes.INTERNAL_SERVER_ERROR,
         message: 'Internal Server Error',
      })
   }
}
async function enableWallet(req, res) {
   const customer_xid = getLogged(req.headers)
   try {
      let wallet = await models.Wallet.findOne({
         where: {
            ownedBy: customer_xid,
         },
      })
      if (!wallet) {
         return res.status(422).json({
            status: 'error',
            message: constants.errorCodes.BAD_DATA_VALIDATION,
            error: 'Wallet not found',
         })
      }
      if (wallet.status === constants.walletStatus.ENABLED) {
         return res.status(422).json({
            status: 'error',
            message: constants.errorCodes.BAD_DATA_VALIDATION,
            error: 'Wallet already enabled',
         })
      }

      await wallet.update({
         status: constants.walletStatus.ENABLED,
         enabledAt: new Date(),
      })
      await wallet.reload()
      return res.status(200).json({
         code: 200,
         status: 'success',
         message: 'detail Wallet',
         data: wallet,
      })
   } catch (err) {
      // res.status(401).json(error)
      return res.status(400).json({
         status: error,
         error: constants.errorCodes.INTERNAL_SERVER_ERROR,
         message: 'Internal Server Error',
      })
   }
}

async function disableWallet(req, res) {
   const joiValidation = {
      is_disabled: Joi.boolean().required(),
   }
   const { error } = Joi.validate(req.body, joiValidation)
   if (error) {
      return res.status(422).json({
         status: 'error',
         message: constants.errorCodes.BAD_DATA_VALIDATION,
         error: error.details[0].message,
      })
   }
   const customer_xid = getLogged(req.headers)
   try {
      let wallet = await models.Wallet.findOne({
         where: {
            ownedBy: customer_xid,
         },
      })

      if (!wallet) {
         return res.status(422).json({
            status: 'error',
            message: constants.errorCodes.BAD_DATA_VALIDATION,
            error: 'Wallet not found',
         })
      }
      if (wallet.status === constants.walletStatus.DISABLED) {
         return res.status(422).json({
            status: 'error',
            message: constants.errorCodes.BAD_DATA_VALIDATION,
            error: 'Wallet already disabled',
         })
      }
      await wallet.update({
         status: constants.walletStatus.DISABLED,
         disabledAt: new Date(),
      })
      await wallet.reload()

      return res.status(200).json({
         status: 'success',
         message: 'detail Wallet',
         data: wallet,
      })
   } catch (error) {
      console.log(error)
      return res.status(400).json({
         status: error,
         error: constants.errorCodes.INTERNAL_SERVER_ERROR,
         message: 'Internal Server Error',
      })
   }
}

module.exports = {
   getDetailWallet,
   createWallet,
   enableWallet,
   disableWallet,
}
