import '../App.css';

import {listNFT} from "../cadence/transactions/list_for_sale.js";
import {unlistFromSaleTx} from "../cadence/transactions/unlist_from_sale.js";

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {useEffect, useState} from 'react';

function AdminStore() {
    const[saleItemID, setID] = useState();
    const[saleItemPrice, setPrice] = useState();
  
    const listForSale = async () => {
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
  
      console.log(transactionId);
      return fcl.tx(transactionId).onceSealed();
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
    
        console.log(transactionId);
        return fcl.tx(transactionId).onceSealed();
    }
  
    return (  

        
        <div className="flex flex-col text-center font-bold  bg-blue-400">
            <h1 className="text-white text-4xl">Admin Storefront Only - List and Unlist your Coins</h1>
            <label>ID: </label>
            <input type="text" onChange={(e) => setID(e.target.value)} />
            <label>Price: </label>
            <input type="text" onChange={(e) => setPrice(e.target.value)} />
            <button onClick={() => listForSale()}>List Coin for Sale</button>
            <button onClick={() => unlistFromSale()}>Unlist Coin from Sale</button>
        </div>     
      
    );
  
  }
  
  export default AdminStore;
  