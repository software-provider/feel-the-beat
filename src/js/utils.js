const getMyAddress = async function (callback){
   // init web3 for connecting to meta mask
   const provider = window.web3.currentProvider
   await provider.enable()

   window.web3.eth.getAccounts((error, result) => {
    if (!error) {
        callback(result[0])
    }
  })
}

const consoleLog = function (obj) {
  console.log(JSON.parse(JSON.stringify(obj)))
}

const shortAddress = function (address) {
  return `${address.substr(0, 5)}...${address.substr(-4)}`
}

const toDateString = function (timestampt) {
  if (timestampt) {
    let d = new Date(timestampt * 1000)
    return `${d.toISOString().slice(0,10)}`
  }
  
  return ''
}

export default {
    getMyAddress: getMyAddress,
    consoleLog: consoleLog,
    shortAddress: shortAddress,
    toDateString: toDateString
  }