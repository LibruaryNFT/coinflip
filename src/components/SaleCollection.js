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
    console.log(result);
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

  //console.log(['nfts',nfts]);

  // commented this block out because it explodes with react and react is a piece of shit
  /*
  let coins = []; // group by coin kinds, 0 (heads) and 1 (tails)
  Object.keys(nfts).forEach(nftID => {
    let kind = nfts[nftID].nftRef.kind.rawValue;
    coins[kind] = coins[kind] ?? []; // declare undefined array if necessary
    coins[kind].push(nfts[nftID]); // add nft to coin group
  });
  console.log(['coins',coins]);

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  let rnd_0 = randomIntFromInterval(0, coins[0].length - 1);
  let rnd_1 = randomIntFromInterval(0, coins[1].length - 1);

  let nfts_rnd = [
    coins[0][rnd_0],
    coins[1][rnd_1]
  ];
  console.log(['nfts_rnd', nfts_rnd]);
  //*/

  return (
    <div>
      <div className="flex flex-col text-center font-bold  bg-green-400">
          <h1 className="text-white text-4xl">Coin Marketplace</h1>
      </div>
      <div className="flex flex-col text-center font-bold  bg-green-400">
        <h1 className="text-white">Purchase these coins in order to play the CoinFlip game.</h1>
      </div>
      <div className="flex flex-col text-center font-bold bg-green-400">
        <table className="text-left table-fixed border-collapse text-white">
          <tbody>
            <tr className="border">
              <th className="border">Coin Details</th>
              <th className="border">Purchase</th>
              <th className="border">TokenID</th>
              <th className="border">Prediction Type</th>  
              <th className="border">Price in $FLOW</th>             
            </tr>

            {Object.keys(nfts).map(nftID => (
              <tr key={nfts[nftID].nftRef.id} className="border">
                <img className="border" src={`https://${nfts[nftID].nftRef.ipfsHash}.ipfs.dweb.link/`}/>
                <td className="border"><button onClick={() => purchase(nftID)}>Purchase this Coin</button></td>
                <td className="border">{nfts[nftID].nftRef.id}</td>
                <td className="border">{nfts[nftID].nftRef.kind.rawValue == 0 ? 'Heads' : 'Tails'}</td>
                <td className="border">{Math.round(nfts[nftID].price)}</td>  
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SaleCollection;
