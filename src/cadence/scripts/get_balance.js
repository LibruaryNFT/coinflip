export const getBalance = `

import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

//https://github.com/onflow/kitty-items/blob/master/cadence/scripts/flow/get_balance.cdc

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)

    let vaultRef = account.getCapability(/public/flowTokenBalance)!
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow reference to the vault balance")

    return vaultRef.balance
}


`