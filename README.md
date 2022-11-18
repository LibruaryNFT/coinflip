# Summary

This dapp allows a user to purchase a Coin(NFT) which is either Heads or Tails, and then they can 'flip it'. If the random outcome on-chain is the same type as their Coin, then they win double the value of the coin back(while losing the coin that was bet).

# Build

This is a react dapp using tailwindcss.

# File Structure

/cadence
    /contracts
    /scripts
    /transactions
    /utilities
/dist
/public
/src
    /cadence
        /scripts
        /transactions
/components
/dist
/img
/js
Admin.js
App.css
index.css
index.html
index.js
coinmonitor.bat
tailwind.config.js

# Emulator Quick Start Guide
Use this to get started on the emulator and test the major functionality

 1. flow emulator start -v
 2. flow deploy project
 3. flow keys generate
 4. flow accounts create --key PublicKey
 5. update flow.json
 6. flow transactions send ./cadence/transactions/setup.cdc
 7. flow transactions send ./cadence/transactions/setup.cdc --signer=Alice
 8. Run three times
 flow transactions send ./cadence/transactions/mint_nft.cdc f8d6e0586b0a20c7 0 0
9. Run for Tokens 0,1,2
flow transactions send ./cadence/transactions/list_for_sale.cdc 0 1.0
10. Expect tokens 0,1,2
flow scripts execute ./cadence/scripts/get_nft_details.cdc f8d6e0586b0a20c7
11. Expect token 0,1,2
flow scripts execute ./cadence/scripts/get_nft_listings.cdc f8d6e0586b0a20c7
12. flow transactions send ./cadence/utilities/fundEmulator.cdc f8d6e0586b0a20c7 1000.0
13. flow transactions send ./cadence/utilities/fundEmulator.cdc 01cf0e2f2f715450 1000.0
14. flow transactions send ./cadence/transactions/purchase.cdc f8d6e0586b0a20c7 0 --signer=Alice
15. Expect tokens 1,2
flow scripts execute ./cadence/scripts/get_nft_details.cdc f8d6e0586b0a20c7
16. Expect token 0
flow scripts execute ./cadence/scripts/get_nft_details.cdc 01cf0e2f2f715450
17. Run for tokens 1,2
flow transactions send ./cadence/transactions/purchase.cdc f8d6e0586b0a20c7 1 --signer=Alice
18. Play game
flow transactions send ./cadence/transactions/play_game.cdc 0 0xf8d6e0586b0a20c7 --signer=Alice
19. Admin flips coin
flow transactions send ./cadence/transactions/flip_coin.cdc 0
20. Play the game for tokens 2,3
21. Admin flips coins

# Testnet Deployment

Admin: 0x9582fcd59741438c
Storefront: 0x28b2715c085b4a79

1. flow keys generate
2. Enter public key: https://testnet-faucet-v2.onflow.org/
3. Store these keys safely
4. Update flow.json testnet-account with the private key and address
5. Ensure flow.json has the right contracts to be deployed
6. Update hardcoded values in scripts/txns

    Hardcoded admin values

    flip_coin.cdc
    flip_coins.cdc
    coinmonitor.bat

7. Update flow.json aliases if needed
8. flow deploy project --network=testnet

9. Verify contracts are deployed https://testnet.flowscan.org/account/0x9582fcd59741438c

10. Create a new email account for the storefront

11. Sign in to the dapp

12. Fund new storefront with some flow from the faucet https://testnet-faucet-v2.onflow.org/
0x28b2715c085b4a79

13. Update all the js script imports for the coin/nftmarketplace contracts

14. Click the setup button for the storefront account

15. Mint a bunch of NFTs of different types 
flow transactions send ./cadence/transactions/mint_nft.cdc 0x28b2715c085b4a79 0 0 --signer=testnet-account --network=testnet

16. As the storefront, list all the NFTs

# Storage Reference

Coin
CollectionStoragePath = /storage/CoinCollection
CollectionPublicPath = /public/CoinCollection
MinterStoragePath = /storage/CoinMinter

NFTMarketplace
/public/SaleCollection
/storage/SaleCollection

# Scripts Reference

get_nft_ids.cdc

    flow scripts execute ./cadence/scripts/get_nft_ids.cdc f8d6e0586b0a20c7 
    flow scripts execute ./cadence/scripts/get_nft_ids.cdc 01cf0e2f2f715450 
    flow scripts execute ./cadence/scripts/get_nft_ids.cdc 0x0af01d98f61b53df --network=testnet
    flow scripts execute ./cadence/scripts/get_nft_ids.cdc 0xf14637e23022698a --network=testnet

    Result: [0]

get_collection_length.cdc

    flow scripts execute ./cadence/scripts/get_collection_length.cdc f8d6e0586b0a20c7
    flow scripts execute ./cadence/scripts/get_collection_length.cdc 01cf0e2f2f715450
    

    Result: 1

get_nft_details.cdc

    flow scripts execute ./cadence/scripts/get_nft_details.cdc f8d6e0586b0a20c7
    flow scripts execute ./cadence/scripts/get_nft_details.cdc 01cf0e2f2f715450

    [A.f8d6e0586b0a20c7.Coin.NFT(uuid: 26, id: 0, kind: A.f8d6e0586b0a20c7.Coin.Kind(rawValue: 0), rarity: A.f8d6e0586b0a20c7.Coin.Rarity(rawValue: 0), 
    sentBy: {0: Capability<&AnyResource{A.f8d6e0586b0a20c7.NonFungibleToken.Receiver}>(address: 0x179b6b1cb6755e31, path: /public/CoinCollection)})]

    borrowEntireNFT

get_nft_listings.cdc

    flow scripts execute ./cadence/scripts/get_nft_listings.cdc f8d6e0586b0a20c7
    flow scripts execute ./cadence/scripts/get_nft_listings.cdc 01cf0e2f2f715450

    Result: {0: A.f8d6e0586b0a20c7.NFTMarketplace.SaleItem(price: 1.00000000, nftRef: A.f8d6e0586b0a20c7.Coin.NFT(uuid: 26, id: 0, 
    kind: A.f8d6e0586b0a20c7.Coin.Kind(rawValue: 0), rarity: A.f8d6e0586b0a20c7.Coin.Rarity(rawValue: 0)))}

    borrowEntireNFT

get_nft_item_full.cdc

    flow scripts execute ./cadence/scripts/get_nft_item_full.cdc f8d6e0586b0a20c7 0
    flow scripts execute ./cadence/scripts/get_nft_item_full.cdc 01cf0e2f2f715450 0

    Result: s.3b735b01e2fa7c0c7fd2fdd50cb4633185b17d3342520757510868ad1d1ebb96.CoinItem(name: "Copper Heads", description: "A copper heads with serial number 0", 
    thumbnail: "https://bafybeibuqzhuoj6ychlckjn6cgfb5zfurggs2x7pvvzjtdcmvizu2fg6ga.ipfs.dweb.link/sm.png", itemID: 0, resourceID: 26, kind: A.f8d6e0586b0a20c7.Coin.Kind(rawValue: 0), 
    rarity: A.f8d6e0586b0a20c7.Coin.Rarity(rawValue: 0), owner: 0xf8d6e0586b0a20c7)

get_metadata.cdc - Broken

    flow scripts execute ./cadence/scripts/get_metadata.cdc f8d6e0586b0a20c7 0
    flow scripts execute ./cadence/scripts/get_metadata.cdc 01cf0e2f2f715450 0

    Result: s.c4aa0591bbf59a3d37d9fe87ef21a27559181ba3ea5309c092515b05ae527f95.NFTResult(name: "Copper Heads", description: "A copper heads with serial number 0", thumbnail: 
    "https://bafybeibuqzhuoj6ychlckjn6cgfb5zfurggs2x7pvvzjtdcmvizu2fg6ga.ipfs.dweb.link/sm.png", itemID: 0, resourceID: 0, kind: 0, rarity: 
    0, owner: 0xf8d6e0586b0a20c7)

check_coincollection.cdc

    flow scripts execute ./cadence/scripts/check_coincollection.cdc f8d6e0586b0a20c7
    flow scripts execute ./cadence/scripts/check_coincollection.cdc 0x28b2715c085b4a79 --network=testnet

# Transactions Reference

0xf59a7e2d7b36c96f

setup_coin.cdc

    flow transactions send ./cadence/transactions/setup_coin.cdc
    flow transactions send ./cadence/transactions/setup_coin.cdc --signer=Alice
    flow transactions send ./cadence/transactions/setup_coin.cdc --signer=testnet-account --network=testnet

setup_coingame.cdc

    flow transactions send ./cadence/transactions/setup_coingame.cdc
    flow transactions send ./cadence/transactions/setup_coingame.cdc --signer=Alice

mint_nft.cdc

    flow transactions send ./cadence/transactions/mint_nft.cdc f8d6e0586b0a20c7 0 0
    flow transactions send ./cadence/transactions/mint_nft.cdc 01cf0e2f2f715450 0 0
    flow transactions send ./cadence/transactions/mint_nft.cdc 0af01d98f61b53df 0 0 --network=testnet --signer=testnet-account

play_game.cdc

    flow transactions send ./cadence/transactions/play_game.cdc 0 0xf8d6e0586b0a20c7 
    flow transactions send ./cadence/transactions/play_game.cdc 0 0xf8d6e0586b0a20c7 --signer=Alice

setup_sales.cdc

    flow transactions send ./cadence/transactions/setup_sales.cdc
    flow transactions send ./cadence/transactions/setup_sales.cdc --network=testnet --signer=testnet-account

flip_coin.cdc

    flow transactions send ./cadence/transactions/flip_coin.cdc f8d6e0586b0a20c7 0
    flow transactions send ./cadence/transactions/flip_coin.cdc f8d6e0586b0a20c7 0 --signer=Alice
    flow transactions send ./cadence/transactions/flip_coin.cdc 01cf0e2f2f715450 0
    flow transactions send ./cadence/transactions/flip_coin.cdc 0x37bbbe2ca948ac9e 0 --network=testnet --signer=testnet-account

flip_coins.cdc

    flow transactions send ./cadence/transactions/flip_coins.cdc


add_coingame.cdc

    flow transactions send ./cadence/transactions/add_coingame.cdc 0 f8d6e0586b0a20c7
    flow transactions send ./cadence/transactions/add_coingame.cdc 0 f8d6e0586b0a20c7 --signer=Alice

remove_coingame.cdc

    flow transactions send ./cadence/transactions/remove_coingame.cdc 0 
    flow transactions send ./cadence/transactions/remove_coingame.cdc 0 --signer=Alice


list_for_sale.cdc

    flow transactions send ./cadence/transactions/list_for_sale.cdc 0 1.0
    flow transactions send ./cadence/transactions/list_for_sale.cdc 0 1.0 --signer=Alice
    flow transactions send ./cadence/transactions/list_for_sale.cdc 0 1.0 --signer=testnet-account --network=testnet

unlist_from_sale.cdc

    flow transactions send ./cadence/transactions/unlist_from_sale.cdc 0
    flow transactions send ./cadence/transactions/unlist_from_sale.cdc 0 --signer=Alice

setup.cdc

    flow transactions send ./cadence/transactions/setup.cdc
    flow transactions send ./cadence/transactions/setup.cdc --signer=Alice

purchase.cdc

    flow transactions send ./cadence/transactions/purchase.cdc f8d6e0586b0a20c7 0
    flow transactions send ./cadence/transactions/purchase.cdc f8d6e0586b0a20c7 0 --signer=Alice

send_coin.cdc

    flow transactions send ./cadence/transactions/send_coin.cdc f8d6e0586b0a20c7 0 --signer=Alice
    flow transactions send ./cadence/transactions/send_coin.cdc 01cf0e2f2f715450 1
    flow transactions send ./cadence/transactions/send_coin.cdc a316f82dd1e5fd4e 1 --network=testnet --signer=testnet-account

# Other scripts/txns

Create emulator accounts

    flow keys generate
    flow accounts create --key PublicKey

    then update the flow.json

fundEmulator.cdc

    flow transactions send ./cadence/utilities/fundEmulator.cdc f8d6e0586b0a20c7 1000.0
    flow transactions send ./cadence/utilities/fundEmulator.cdc 01cf0e2f2f715450 1000.0

getBalance.cdc

    flow scripts execute ./cadence/utilities/get_balance.cdc f8d6e0586b0a20c7
    flow scripts execute ./cadence/utilities/get_balance.cdc 01cf0e2f2f715450