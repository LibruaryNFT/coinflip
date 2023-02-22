import '../App.css';
import "../dist/output.css"

import SetupAccount from "./SetupAccount.js"
import CoinCollection from "./CoinCollection.js"
import CoinStore from "./CoinStore.js"
import PreviousCoinFlips from "./PreviousCoinFlips.js"


function Waterfall ({user, coincollectioncheck, txId, txInProgress,txStatus, txStatusCode}) {

    if (txInProgress) {
        return (
            <article>
                {txStatus < 0 

                ?

                    <div>
                        Transaction: Initializing
                    </div>

                : txStatus < 2

                ?


                    <div>
                        Transaction: Pending
                    </div> 

                :

                txStatus === 2     
                 
                ?
                    <div>
                        Transaction: Finalized
                    </div> 

                : txStatus === 3

                ?

                    <div>
                        Transaction: Executed
                    </div>

                : txStatus === 4

                ? 

                    <div>
                        Transaction: Sealed
                    </div>

                 : null}

            </article>
        )

    } else if (txStatusCode === 1) {

     return (
      <article>PROBLEM!!!!!!!!!! View problem here: <span className="txId">
      <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId?.slice(0,8)}...</a>
    </span></article>

     ) 
     
    } else if (user) {

        if (user.loggedIn == true && coincollectioncheck == true) {

            return (
             
                <div>
                No current transaction. User logged in and collection is set-up.
                </div>
            ) 
            
        }

        if (user.loggedIn == true && coincollectioncheck == false) {

            return (
             <div>No current transaction.  User logged in and collection is NOT set-up.</div>
           
            ) 
        }
            
    }

    else if (user == null) {
        return (
            <div>No current transaction.  User is NOT logged in.</div>
           
        )
    }
      
    else {
        return (
            <div>You haven't thrown a coin in yet!</div>
        )
      }
    }
  
export default Waterfall



