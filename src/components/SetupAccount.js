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
        <button onClick={() => setupTheAccount()}>Your account is not setup yet. Please click this button to set it up. This is only done once per account.</button>
        </div>
        <SetupTransaction txId={txId} txInProgress={txInProgress} txStatus={txStatus}/>     
    </div>
  );

}

export default SetupAccount;
