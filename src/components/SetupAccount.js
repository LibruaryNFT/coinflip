import '../App.css';
import "../dist/output.css"

import * as fcl from "@onflow/fcl";


import {setup} from  "../cadence/transactions/setup.js";
import {useState, useEffect} from 'react';

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function SetupAccount() {

  useEffect(() => {

  }, [])



  const setupTheAccount = async () => {
    const transactionId = await fcl.send([
      fcl.transaction(setup),
      fcl.payer(fcl.currentUser),
      fcl.proposer(fcl.currentUser),
      fcl.authorizations([fcl.currentUser]),
      fcl.limit(9999)
    ]).then(fcl.decode);

    console.log(transactionId)
  }


  return (
    <div className="bg-black">
        <div className="px-4 py-2 text-white rounded-full md:py-1 bg-purple-600 hover:bg-brightRedLight font-bold md:w-1/4">
        <button onClick={() => setupTheAccount()}>Your account is not setup yet. Please click this button to set it up. This is only done once per account.</button>
        </div>     
    </div>
  );

}

export default SetupAccount;
