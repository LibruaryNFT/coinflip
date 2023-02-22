import '../App.css';
import '../dist/output.css';

function SaleTransaction ({txId, txInProgress, txStatus, txStatusCode}) {

  if (txInProgress) {
        return (
            <article>
                {txStatus < 0 

                ?

                    <div>
                        <span>
                            Transaction Status: Initializing
                            <br/>
                            <small>Waiting for transaction approval.</small>
                    
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
                        <small>The purchase transaction is currently pending.</small>
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
                        <small>The transaction to purchase this coin is currently executing.</small>
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
                            <small>The purchase transaction is currently sealing.</small>
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
                            <small>Transaction Complete. At this point the transaction result has been committed to the blockchain. You now own this coin, please refresh the page.</small>
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



export default SaleTransaction;