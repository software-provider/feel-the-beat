## Feel The Beat
Feel The Beat is application/game lets anyone compose/create unique digital beats music cards and mint it as NFT assets. Users have authority to the own beats, participate in battle challenge to earn rewards

**Studio**
- Users compose the own beats by Music Pad application
- Users mint composed beats as NFT assets (ERC721 tokens). And related images, audios and metadata will be stored in IPFS

**Arena**
- Promoters donate reward to initialize music battles
- Players participate in the battle, discover beats and vote for the best one
- Player owns the highest voting beat after the battle ended will be the winner


## Technical stack
- Truffle & Ganache
- Vuejs & daisyui
- Solidity smart contract
- IPFS - Nft.Storage 
- ToneJs


## What's next
- The current Music Pad is simple for showing ideas. It should be developed to users can compose the professional beat
- The smart contract is simple for showing ideas. It should be developed seriously


## Usage
1/ Configure `truffle-config.js` correctly 

2/ Compile & deploy smart contracts

```
truffle.cmd migrate
```

3/ Run app

```
npm run start
```