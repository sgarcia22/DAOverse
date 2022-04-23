# [The DAOVerse](https://thedaoverse.org/)

## What is The DAOVerse?

The DAOVerse is a 3D Web & VR-enabled metaverse dApp facilitating community onboarding & engagement. DAOs, NFTs & Web3 communities can create their own gamified experiences for the earning of tokens/rewards/NFT Badges in tailored community virtual spaces.

## Why did we create The DAOVerse?
Given the ethos behind a decentralized community, there are inherent pain points associated with managing growth. New and prospective community members often times are asked to join several fragmented social media platforms such as Telegram, Discord, Twitter – with no real clear flow of information or engagement. You join, and then what? The bounce rate, attrition rate and diffusion of responsibility inherent in social dynamics makes it a real challenge to meaningfully strengthen and grow your community. As members of Blu3DAO along with multiple other DAOs and NFT project communities, our core DAOVerse team has first-hand experience with these issues. 

After extensive research, we discovered that there are not presently any impactful online gamification platforms aimed at creating an engaging onboarding and continued community experience with ongoing reward challenges for core contributors. This is especially true when it comes to bridging DAOs (or other Web3 communities) in a simple way, into evolving metaverse landscape capabilities. Social science reinforces the fact that the strengthening of communities relies on continued and meaningful social engagement. This is what The DAOVerse facilitates.


## What technologies did we use for our dApp?
- Coinbase Wallet
- WalletConnect
- Web3Auth
- ethers
- Web3React
- Tatum, Polygon, IPFS

# Tatum, Polygon, IPFS Code Usage

Ran on Postman Workspace (postman.co) <br />
Used Tatum to create wallet on Polygon, make address, generate private key, upload NFT image to IPFS, and mint an NFT to a user address <br />

HTTP Request to Mint NFT: <br />
POST https://api-eu1.tatum.io/v3/nft/mint
```json
{
   "chain": "MATIC",
   "tokenId": "3",
   "to": "0x06bd56506d1983af065b1837EFf23DA1a3e30472",
   "contractAddress": "0xe1f825651f527006e77cfe8f519bc93415c9e888",
   "url": "ipfs://bafkreifgrczpk3has4alltnjvr4vmkhxc7ax3n77xjxhjft7pgry567sze",
   "fromPrivateKey": PRIVATE_KEY
}
```

Minted NFT URL on Opensea: <br />
https://testnets.opensea.io/assets/mumbai/0xe1f825651f527006e77cfe8f519bc93415c9e888/3 <br />
Testnet Polyscan Transaction: <br />
https://mumbai.polygonscan.com/tx/0x19ba8807789465f87e60091d783a2afdbbf3df41e95791ce920fe2aa4e977107 <br />
