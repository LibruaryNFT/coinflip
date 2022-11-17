import '../App.css';
import '../dist/output.css';

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {useState, useEffect} from 'react';
import {getNFTListings} from "../cadence/scripts/get_nft_listings.js";
import {purchaseTx} from "../cadence/transactions/purchase.js";

function SaleCollection(props) {
  const [nfts, setNFTs] = useState([]);

  useEffect(() => {

    getUserSaleNFTs();

    }, [])
    

  const getUserSaleNFTs = async () => {
      const result = await fcl.send([
          fcl.script(getNFTListings),
          fcl.args([
              fcl.arg(props.address, t.Address)
          ])
      ]).then(fcl.decode);
      setNFTs(result);
  }

  const purchase = async (id) => {
    const transactionId = await fcl.send([
        fcl.transaction(purchaseTx),
        fcl.args([
          fcl.arg(props.address, t.Address),
          fcl.arg(parseInt(id), t.UInt64)
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999)
      ]).then(fcl.decode);
  
      console.log(transactionId);
      return fcl.tx(transactionId).onceSealed();
  }
 
  return (
    <div className="flex flex-col text-center font-bold bg-green-400">
      
       {Object.keys(nfts).map(nftID => (
          <div key={nftID}>
              <h3>ID: {nftID}</h3>
              <h3>Kind: {nfts[nftID].nftRef.kind.rawValue}</h3>
              <h3>Rarity: {nfts[nftID].nftRef.rarity.rawValue}</h3>
              <h3>Price: {nfts[nftID].price}</h3>
              <button onClick={() => purchase(nftID)}>Purchase this Coin</button><br></br>
          </div>
      ))}
    </div>
  );
}

export default SaleCollection;
