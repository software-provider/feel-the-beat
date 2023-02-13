import contract from 'truffle-contract'
import BeatBattleContract from '@contracts/BeatBattle.json'
import NftStorage from '@/js/nft-storage'
import axios from 'axios'

const Battles = {

    contract: null,

    instance: null,

    init: function () {
        let self = this

        return new Promise(function (resolve, reject) {
            self.contract = contract(BeatBattleContract)
            self.contract.setProvider(window.web3.currentProvider)

            self.contract.deployed().then(instance => {
                self.instance = instance
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    },
    createBattle: function (reward, name, description, startTime, endTime, imageFile, callback) {        
        let self = this
        const formData = new FormData()
        // ipfs image
        let imageFileName = 'image.' + imageFile.name.split('.').pop()
        formData.append('file', imageFile, imageFileName)

        // ipfs metadata
        let metadata = { name: name, description: description, startTime: startTime, endTime: endTime }
        let metadataFileName = 'metadata.json'
        formData.append('file', new Blob([JSON.stringify(metadata)], { type: 'application/json' }), metadataFileName)
        NftStorage.uploadNftStorage(formData, function (res) {
          if (res.data.ok) {
            let ipfsUri = `https://${res.data.value.cid}.ipfs.dweb.link/`
            let ipftImage = 'https://' + res.data.value.cid + '.ipfs.dweb.link/' + imageFileName
            let ipftMetadata = 'https://' + res.data.value.cid + '.ipfs.dweb.link/' + metadataFileName
            console.log('ipftImage', ipftImage)
            console.log('ipftMetadata', ipftMetadata)
    
            self.instance.createBattle(
                startTime,
                endTime,
                ipfsUri,
                {from: window.web3.eth.accounts[0], value: web3.toWei(reward, 'ether')}
              ).then(rs => {
                callback(null, rs)
              }).catch(err => {
                callback(err)
              })
          }
        })
    },
    getBattle: function (battleId) {
        let self = this
        return new Promise((resolve, reject) => {
            self.instance.getBattle(
                battleId,
                { from: window.web3.eth.accounts[0] }
            ).then(tx => {
                console.log('getBattle tx', JSON.stringify(tx))

                let ipfsUri = tx[3]

                let battleInfo = {
                    id: tx[0].toNumber(),
                    startTime: tx[1].toNumber(),
                    endTime: tx[2].toNumber(),
                    metadata: `${ipfsUri}/metadata.json`,
                    image: `${ipfsUri}/image.jpg`,
                    beatIds: tx[4],
                    reward:  tx[5]
                  }
                axios.get(`${battleInfo.metadata}`).then((res) => {
                    battleInfo.name = res.data.name
                    battleInfo.description = res.data.description

                    resolve(battleInfo)
                  })
            }).catch(err => {
                reject(err)
            })
        })
    },
    getBattleCount: function () {
        let self = this
        return new Promise((resolve, reject) => {
            self.instance.getBattleCount(
                { from: window.web3.eth.accounts[0] }
            ).then(tx => {
                resolve(tx)
            }).catch(err => {
                reject(err)
            })
        })
    },
    voteBeat: function (battleId, beatId) {
        let self = this
        return new Promise((resolve, reject) => {
            self.instance.vote(battleId, beatId, { from: window.web3.eth.accounts[0] }
            ).then(tx => {
                resolve(tx)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getVoteInfo: function (battleId, beatId) {
        let self = this
        return new Promise((resolve, reject) => {
            self.instance.getVotingBeatInfo(battleId, beatId, { from: window.web3.eth.accounts[0] }
            ).then(tx => {
                resolve(tx)
            }).catch(err => {
                reject(err)
            })
        })
    },
    join: function (battleId, beatId) {
        let self = this
        return new Promise((resolve, reject) => {
            self.instance.join(battleId, beatId, { from: window.web3.eth.accounts[0] }
            ).then(tx => {
                resolve(tx)
            }).catch(err => {
                reject(err)
            })
        })
    },
    claimReward: function (battleId) {
        let self = this
        return new Promise((resolve, reject) => {
            self.instance.claimReward(battleId, { from: window.web3.eth.accounts[0] }
            ).then(tx => {
                resolve(tx)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getWinningBeat: function (battleId) {
        let self = this
        return new Promise((resolve, reject) => {
            self.instance.getWinningBeat(battleId, { from: window.web3.eth.accounts[0] }
            ).then(tx => {
                resolve(tx)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export default Battles
