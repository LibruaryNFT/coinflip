import '../App.css';

import {listNFT} from "../cadence/transactions/list_for_sale.js";
import {unlistFromSaleTx} from "../cadence/transactions/unlist_from_sale.js";
import Transaction from "./Transaction.js";

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {useEffect, useState} from 'react';

function AdminStore() {
    const[saleItemID, setID] = useState();
    const[saleItemPrice, setPrice] = useState();
    const[txId, setTxId] = useState();
    const[txInProgress, setTxInProgress] = useState(false);
    const[txStatus, setTxStatus] = useState(-1);
  
    const listForSale = async () => {
      setTxInProgress(true);
      setTxStatus(-1);
      const transactionId = await fcl.send([
        fcl.transaction(listNFT),
        fcl.args([
            fcl.arg(parseInt(saleItemID), t.UInt64),
            fcl.arg(saleItemPrice, t.UFix64),
        ]),
        fcl.payer(fcl.currentUser),
        fcl.proposer(fcl.currentUser),
        fcl.authorizations([fcl.currentUser]),
        fcl.limit(9999)
      ]).then(fcl.decode);
      
      setTxId(transactionId);
      fcl.tx(transactionId).subscribe(res => {

        setTxStatus(res.status);

        console.log(res);
      })
   
  
    }

    
    
  
    const unlistFromSale = async () => {
        const transactionId = await fcl.send([
          fcl.transaction(unlistFromSaleTx),
          fcl.args([
            fcl.arg(parseInt(saleItemID), t.UInt64)
          ]),
          fcl.payer(fcl.authz),
          fcl.proposer(fcl.authz),
          fcl.authorizations([fcl.authz]),
          fcl.limit(9999)
        ]).then(fcl.decode);
    

    }

    
  
  
    return (  

        <div>
          <div className="flex flex-col text-center font-bold  bg-blue-400">
            <h1 className="text-white text-4xl">Admin Storefront Only - List and Unlist your Coins</h1>
            <label>ID: </label>
            <input type="text" onChange={(e) => setID(e.target.value)} />
            <label>Price: </label>
            <input type="text" onChange={(e) => setPrice(e.target.value)} />
            <button onClick={() => listForSale()}>List Coin for Sale</button>
            <button onClick={() => unlistFromSale()}>Unlist Coin from Sale</button>
           
          </div>     
          <Transaction txId={txId} txInProgress={txInProgress} txStatus={txStatus}/>
        </div>
        
      
    );
  
  }
  
  export default AdminStore;
  