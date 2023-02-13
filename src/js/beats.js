import contract from 'truffle-contract'
import BeatsContract from '@contracts/FeelTheBeat.json'
import axios from 'axios'
import AppConstants from './app-constants'
import NftStorage from './nft-storage'

const Beats = {

  contract: null,

  instance: null,

  init: function () {
    let self = this

    

    return new Promise(function (resolve, reject) {
      self.contract = contract(BeatsContract)
      self.contract.setProvider(window.web3.currentProvider)

      self.contract.deployed().then(instance => {
        self.instance = instance
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  getContractAddress: async function() {
    let tokenInstance = await this.contract.deployed()
    return tokenInstance.address
  },
  create: function (tokenUri) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.createBeat(
        tokenUri,
        {from: window.web3.eth.accounts[0]}
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  },
  get: function (tokenId) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.tokenURI(
        tokenId,
        {from: window.web3.eth.accounts[0]}
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getBeatInfo: function (tokenId, callback) {
    Beats.get(tokenId).then((tokenUri) => {
      axios.get(`${tokenUri}/metadata.json`)
      .then((res) => {
        const beatInfo = {
          // id: `${contractAddress}:${tokenId}`,
          id: tokenId,
          name: res.data.name,
          description: res.data.description,
          author: res.data.author,
          image: `${tokenUri}/${AppConstants.MINT_IMAGE_NAME}`,
          audio: `${tokenUri}/${AppConstants.MINT_AUDIO_NAME}`
        }
        callback(null, beatInfo)
      })
      .catch(err => {
        callback(err)
      })
    })
  },
  getTokensOfOwner: function(addr) {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.tokensOfOwner(
        addr,
        {from: window.web3.eth.accounts[0]}
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  },
  mint: function (imageFile, audioFile, metadata, callback) {
    let self = this
    const formData = new FormData()
    // ipfs image
    let imageFileName = 'image.' + imageFile.name.split('.').pop()
    formData.append('file', imageFile, imageFileName)
     // ipfs sound
    let audioFileName = 'audio.' + audioFile.name.split('.').pop()
    formData.append('file', audioFile, audioFileName)
    // ipfs metadata
    let metadataFileName = 'metadata.json'
    formData.append('file', new Blob([JSON.stringify(metadata)], { type: 'application/json' }), metadataFileName)
    NftStorage.uploadNftStorage(formData, function (res) {
      if (res.data.ok) {
        let tokenUri = `https://${res.data.value.cid}.ipfs.dweb.link/`
        let ipftImage = 'https://' + res.data.value.cid + '.ipfs.dweb.link/' + imageFileName
        let ipftAudio = 'https://' + res.data.value.cid + '.ipfs.dweb.link/' + audioFileName
        let ipftMetadata = 'https://' + res.data.value.cid + '.ipfs.dweb.link/' + metadataFileName
        console.log('ipftAudio', ipftAudio)
        console.log('ipftImage', ipftImage)
        console.log('ipftMetadata', ipftMetadata)

        self.instance.createBeat(
          tokenUri,
            {from: window.web3.eth.accounts[0]}
          ).then(rs => {
            callback(null, rs)
          }).catch(err => {
            callback(err)
          })
      }
    })
  },
  drawImageCanvas: function(canvas, noteGrid){
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 20 * noteGrid.colCount, 20 * noteGrid.rowCount);

    for (let r = 0; r < noteGrid.rowCount; r++) {
      for (let c = 0; c < noteGrid.colCount; c++) {
      
        let note = noteGrid.data[r][c]
        
        if (note.selected){
          let color = AppConstants.MUSIC_NOTES.filter(
            (n) => n.name === note.name
          )[0].color
          ctx.fillStyle = color
          ctx.fillRect(20 * (c), 20 * (r), 20, 20)
        }
      }
    }
    
    return canvas;
  }
}

export default Beats
