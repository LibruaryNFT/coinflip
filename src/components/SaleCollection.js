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
          <h1 className="text-white text-4xl pb-4">Coin Store</h1>
      </div>
      <div className="flex flex-col text-center font-bold bg-green-400">
        <table className="text-left table-fixed border-collapse text-white">
          <tbody>      

            {Object.keys(nfts).map(nftID => (
              <tr key={nfts[nftID].nftRef.id} className="border">
                <div className="relative"><img className="border cursor-pointer rounded-full max-w-xs mx-auto" src={`https://${nfts[nftID].nftRef.ipfsHash}.ipfs.dweb.link/`} onClick={() => purchase(nftID)}/><button className="absolute top-0 px-4 py-2 text-white md:py-1 bg-purple-600 font-bold cursor-default">Click Coin to Purchase</button><button className="absolute bottom-0 right-0 px-4 py-2 text-white md:py-1 bg-purple-600 font-bold cursor-default">TokenID: {nfts[nftID].nftRef.id}<br></br>Type: {nfts[nftID].nftRef.kind.rawValue == 0 ? 'Heads' : 'Tails'}<br></br>Price: {Math.round(nfts[nftID].price)} $FLOW</button></div>      
                 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SaleCollection;
