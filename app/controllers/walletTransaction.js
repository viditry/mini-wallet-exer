const models = require('../models')
const constants = require('../constants')
const Joi = require('@hapi/joi')
const getLogged = require('../helpers/getLogged')
const validateWallet = require('../helpers/validateWallet')

async function validateReferenceId({ reference_id, transaction = null }) {
   return await models.WalletTransaction.findOne({
      where: {
         reference_id,
      },
      transaction,
   })
}

async function createTransaction({
   walletId,
   type,
   referenceId,
   amount,
   transaction,
}) {
   return await models.WalletTransaction.create(
      {
         walletId,
         type,
         referenceId,
         debit:
            constants.walletTransactionType.WITHDRAWAL === type ? amount : 0,
         credit: constants.walletTransactionType.DEPOSIT === type ? amount : 0,
      },
      { transaction },
   )
}

async function createWithdrawal(req, res) {
   const joiValidation = {
      reference_id: Joi.string().guid().required(),
      amount: Joi.number().min(1000).required(),
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
   const { amount, reference_id } = req.body
   let transaction
   try {
      transaction = await models.sequelize.transaction()
      let wallet = await models.Wallet.findOne({
         where: {
            ownedBy: customer_xid,
         },
         transaction,
      })

      const validateWalletResult = validateWallet(wallet)
      console.log(validateWalletResult.success)
      if (!validateWalletResult.success) {
         return res.status(422).json(validateWalletResult)
      }

      if (Number(wallet.balance) < Number(amount)) {
         res.status(422).json({
            status: 'error',
            message: constants.errorCodes.BAD_USER_INPUT,
            error: 'insufficient balance',
         })
      }

      const result = await validateReferenceId({ reference_id, transaction })
      if (result) {
         return res.status(422).json({
            status: 'error',
            message: constants.errorCodes.BAD_DATA_VALIDATION,
            error: 'reference id already exists',
         })
      }
      const walletTransaction = await createTransaction({
         walletId: wallet.id,
         type: constants.walletTransactionType.WITHDRAWAL,
         referenceId: reference_id,
         amount,
         transaction,
      })
      wallet.balance = Number(wallet.balance) - Number(amount)
      await wallet.save({ transaction })
      const {
         id,
         walletId: withdrawn_by,
         status,
         createdAt: withdrawn_at,
      } = walletTransaction
      transaction.commit()
      return res.status(200).json({
         code: 200,
         status: 'success',
         message: 'detail Wallet Transaction',
         data: {
            deposit: {
               id,
               withdrawn_by,
               status,
               withdrawn_at,
               amount,
               reference_id,
            },
         },
      })
   } catch (err) {
      if (transaction) {
         transaction.rollback()
      }
      // res.status(401).json(error)
      return res.status(400).json({
         status: error,
         error: constants.errorCodes.INTERNAL_SERVER_ERROR,
         message: 'Internal Server Error',
      })
   }
}

async function createDeposit(req, res) {
   const joiValidation = {
      reference_id: Joi.string().guid().required(),
      amount: Joi.number().min(1000).required(),
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
   const { amount, reference_id } = req.body
   let transaction
   try {
      transaction = await models.sequelize.transaction()
      let wallet = await models.Wallet.findOne({
         where: {
            ownedBy: customer_xid,
         },
         transaction,
      })
      const validateWalletResult = validateWallet(wallet)
      if (!validateWalletResult.success) {
         return res.status(422).json(validateWalletResult)
      }

      const result = await validateReferenceId({ reference_id, transaction })
      if (result) {
         return res.status(422).json({
            status: 'error',
            message: constants.errorCodes.BAD_DATA_VALIDATION,
            error: 'reference id already exists',
         })
      }
      const walletTransaction = await createTransaction({
         walletId: wallet.id,
         type: constants.walletTransactionType.DEPOSIT,
         referenceId: reference_id,
         amount,
         transaction,
      })
      wallet.balance = Number(wallet.balance) + Number(amount)
      await wallet.save({ transaction })

      const {
         id,
         walletId: deposited_by,
         status,
         createdAt: deposited_at,
      } = walletTransaction
      transaction.commit()
      return res.status(200).json({
         code: 200,
         status: 'success',
         message: 'detail Wallet Transaction',
         data: {
            deposit: {
               id,
               deposited_by,
               status,
               deposited_at,
               amount,
               reference_id,
            },
         },
      })
   } catch (err) {
      if (transaction) {
         transaction.rollback()
      }
      console.log(err)
      // res.status(401).json(error)
      return res.status(400).json({
         status: error,
         error: constants.errorCodes.INTERNAL_SERVER_ERROR,
         message: 'Internal Server Error',
      })
   }
}

module.exports = {
   createWithdrawal,
   createDeposit,
}
