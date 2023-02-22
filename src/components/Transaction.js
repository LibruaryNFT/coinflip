import '../App.css';
import '../dist/output.css';

function Transaction ({txId, txInProgress, txStatus, txStatusCode}) {

  if (txInProgress) {
        return (
            <article>
                {txStatus < 0 

                ?

                    <div>
                        <span>
                            Transaction Status: Initializing
                            <br/>
                            <small>You have the coin in your hands, ready to toss it into my waters!</small>
                    
                        </span>
                        <br/>           
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '0%'}}></div>
                        </div>
                    </div>

                : txStatus < 2

                ?


                    <div>
                        <span>
                            Transaction Status: 
                            <span className="txId">
                                <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId}</a>
                            </span>
                        Pending
                        <br/>
                        <small>You have tossed the coin into the air towards my waters!</small>
                        </span>
                        <br/>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '25%'}}></div>
                        </div>
                    </div> 

                :

                txStatus === 2     
                 
                ?
                    <div>
                        <span>
                        Transaction Status: 
                            <span className="txId">
                                <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId}</a>
                            </span>
                        Finalized
                        <br/>
                        <small>The coin has hit my waters!</small>
                        </span>
                        <br/>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '50%'}}></div>
                        </div>
                    </div> 

                : txStatus === 3

                ?

                    <div>
                        <span>
                        Transaction Status: 
                            <span className="txId">
                                <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId?.slice(0,8)}...</a>
                            </span>
                            Executed
                            <br />
                            <small>The coin is now sinking towards the bottom of the waters.</small>
                        </span>
                        <br/>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '75%'}}></div>
                        </div>
                    </div>

                : txStatus === 4

                ? 

                    <div>
                        <span>
                        Transaction Status: 
                        <span className="txId">
                            <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId?.slice(0,8)}...</a>
                        </span>
                            Sealed
                            <br />
                            <small>The coin is still falling to the bottom. We will wait a few moments, around 25 seconds, to see how it lands. Scroll to the Live Coin Result section to see the real-time result.</small>
                        </span>
                        <br/>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '100%'}}></div>
                        </div>
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
     
      } else {
        
      }
    }



export default Transaction;