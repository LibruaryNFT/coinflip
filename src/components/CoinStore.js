import '../App.css';
import '../dist/output.css';

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {useState, useEffect} from 'react';
import {getNFTListings} from "../cadence/scripts/get_nft_listings.js";
import {purchaseTx} from "../cadence/transactions/purchase.js";
import SaleTransaction from "./SaleTransaction.js";

function CoinStore(props) {
  const [nfts, setNFTs] = useState([]);
  const [coins, setCoins] = useState([]);
  const [randomCoins, setRandomCoins] = useState([]);
  const[txId, setTxId] = useState();
  const[txInProgress, setTxInProgress] = useState(false);
  const[txStatus, setTxStatus] = useState(-1);

  useEffect(() => {

    getUserSaleNFTs();

  }, [])

  useEffect(() => {
    setTimeout(() => {
      randomCoin();
    }, 500);
  }, [nfts]);

  const getUserSaleNFTs = async () => {
    const result = await fcl.send([
        fcl.script(getNFTListings),
        fcl.args([
            fcl.arg(props.address, t.Address)
        ])
    ]).then(fcl.decode);
    setNFTs(result);
    console.log('getUserSaleNFTs', result);
  }

  const purchase = async (id) => {
    setTxInProgress(true);
    setTxStatus(-1);
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

    setTxId(transactionId);
      fcl.tx(transactionId).subscribe(res => {

        setTxStatus(res.status);

        console.log(res);
      })

    return fcl.tx(transactionId).onceSealed();
  }

  //console.log(['nfts',nfts]);

  // commented this block out because it explodes with react and react is a piece of shit
  //* //*/
  //let coins = []; // group by coin kinds, 0 (heads) and 1 (tails)

  function coinArray() {
    //getUserSaleNFTs();
    Object.keys(nfts).forEach(nftID => {
      let kind = nfts[nftID].nftRef.kind.rawValue;
      coins[kind] = coins[kind] ?? []; // declare undefined array if necessary
      coins[kind].push(nfts[nftID]); // add nft to coin group
    });
    
    
    //console.log('coins[0].length', coins[0].length);
    //console.log('coins[1].length', coins[1].length);

  }

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)

  }

  function randomCoin() {
    coinArray();
    console.log(['coinArray',coins]);
    console.log('coins[0].length', coins[0].length);
    console.log('coins[1].length', coins[1].length);
    let rnd_0 = randomIntFromInterval(0, coins[0].length - 1);
    let rnd_1 = randomIntFromInterval(0, coins[1].length - 1);
    let nfts_rnd = [
      coins[0][rnd_0],
      coins[1][rnd_1]
    ];
    console.log(['randomCoin', nfts_rnd]);
    setRandomCoins(nfts_rnd);
  }
    
  

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="flex flex-col text-center font-bold">
          <h1 className="text-white text-4xl pb-4">Shop of Curiosity</h1>
          <h2 className="italic">Purchase a coin with a marked side of Heads or Tails. After purchasing, refresh and it will show up in your inventory, neat right?<br></br>

          <div className="fixed left-0 right-0 bottom-0 w-screen z-50 overflow-auto bg-gray-700 opacity-90 flex flex-col items-center justify-center">

	            <h2 className="text-center text-white text-xl font-semibold"><SaleTransaction txId={txId} txInProgress={txInProgress} txStatus={txStatus}/></h2>
          </div>
          </h2>
      </div>
      <div className="flex flex-col text-center font-bold">
        <table className="text-left table-fixed border-collapse text-white">
          <tbody>      

            {Object.keys(randomCoins).map(id => (
              <tr key={randomCoins[id].nftRef.id} className="border">
                <td className="relative ">
                  
                  <img className="border-dashed cursor-pointer rounded-full w-64 h-64 mx-auto" src={`https://gateway.pinata.cloud/ipfs/${randomCoins[id].nftRef.ipfsHash}`} onClick={() => purchase(randomCoins[id].nftRef.id)}/>
                
                  <button className="absolute top-0 px-4 py-2 text-white md:py-1 bg-purple-600 font-bold cursor-default">Touch Coin to Purchase</button>
                  <button className="absolute bottom-0 right-0 px-4 py-2 text-white md:py-1 bg-purple-600 font-bold cursor-default">
                    TokenID: {randomCoins[id].nftRef.id}<br></br>Type: {randomCoins[id].nftRef.kind.rawValue == 0 ? 'Heads' : 'Tails'}<br></br>Price: {Math.round(randomCoins[id].price)} $FLOW</button></td>      
                 
              </tr>
            ))}
          </tbody>
        </table>
      </div> 
    </div>
  );
}

export default CoinStore;
 