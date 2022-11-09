import FlowToken from 0x0ae53cb6e3f42a79
import FungibleToken from 0xee82856bf20e2aa6

transaction(addr: Address, amount: UFix64) {
  let provider: &{FungibleToken.Provider}

  prepare(acct: AuthAccount) {
    self.provider = acct.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault) ?? panic("vault not found")
  }

  execute {
    let tokens <- self.provider.withdraw(amount: amount)
    getAccount(addr).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver).borrow()!.deposit(from: <-tokens)
  }
}