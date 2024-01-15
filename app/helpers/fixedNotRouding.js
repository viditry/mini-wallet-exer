module.exports = (number) => {
   return Number(number.toString().match(/^\d+(?:\.\d{0,6})?/))
}
