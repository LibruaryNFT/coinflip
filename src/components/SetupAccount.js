import '../App.css';
import "../dist/output.css"

import * as fcl from "@onflow/fcl";

import SetupTransaction from "./SetupTransaction.js";

import {setup} from  "../cadence/transactions/setup.js";
import {useState, useEffect} from 'react';

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function SetupAccount() {

  const[txId, setTxId] = useState();
  const[txInProgress, setTxInProgress] = useState(false);
  const[txStatus, setTxStatus] = useState(-1);

  useEffect(() => {

  }, [])



  const setupTheAccount = async () => {
    setTxInProgress(true);
    setTxStatus(-1);
    const transactionId = await fcl.send([
      fcl.transaction(setup),
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


  return (
    
      <div className="bg-purple-600">
        <div className="px-4 py-2 text-white rounded-full md:py-1 hover:bg-brightRedLight font-bold md:w-1/4">
        <button onClick={() => setupTheAccount()}>Oh great, I now know who you are! <br></br>One last thing before I share what I can offer you.. <br></br>All brand new visitors I meet must promise not to jump into my waters and take my treasures! Don't worry, this is only done once and then I'll never ask you again!</button>
        </div>
        <h2>Transaction Details</h2>
        <SetupTransaction txId={txId} txInProgress={txInProgress} txStatus={txStatus}/>     
      </div>
    
  );

}

export default SetupAccount;
