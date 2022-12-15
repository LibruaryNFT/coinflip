export const getTotalSupply = `
import Coin from 0x91b3acc974ec2f7d

pub fun main(): UInt64 {    
    return Coin.totalSupply
}
`