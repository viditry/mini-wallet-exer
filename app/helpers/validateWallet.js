const constants = require('../constants')
module.exports = (wallet) => {
   if (!wallet) {
      return {
         status: 'error',
         message: constants.errorCodes.BAD_DATA_VALIDATION,
         error: 'Wallet not found',
      }
   }
   if (wallet.status === constants.walletStatus.DISABLED) {
      return {
         status: 'error',
         message: constants.errorCodes.BAD_DATA_VALIDATION,
         error: 'Wallet is disabled',
      }
   }
   return { success: true }
}
