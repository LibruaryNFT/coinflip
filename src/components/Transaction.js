function Transaction ({txId, txInProgress, txStatus, txStatusCode}) {

  if (txInProgress) {
        return (
            <article>
                {txStatus < 0 

                ?

                    <div>
                        <span>
                            Transaction Status: <kbd>Initializing</kbd>
                            <br/>
                            <small>Waiting for transaction approval.</small>
                        </span>
                        <progress indeterminate="true">Initializing</progress>
                    </div>

                : txStatus < 2

                ?


                    <div>
                        <span>
                            Transaction Status: 
                            <span className="txId">
                                <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId}</a>
                            </span>
                        <kbd>Pending</kbd>
                        <br/>
                        <small>The transaction is currently pending.</small>
                        </span>
                    <progress indeterminate="true">Finalizing...</progress>
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
                        <kbd>Finalized</kbd>
                        <br/>
                        <small>The transaction is currently executing.</small>
                        </span>
                        <progress min="0" max="100" value="60">Executing...</progress>
                    </div> 

                : txStatus === 3

                ?

                    <div>
                        <span>
                        Transaction Status: 
                            <span className="txId">
                                <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId?.slice(0,8)}...</a>
                            </span>
                            <kbd>Executed</kbd>
                            <br />
                            <small>The transaction is currently sealing.</small>
                        </span>
                        <progress min="0" max="100" value="80">Sealing...</progress>
                    </div>

                : txStatus === 4

                ? 

                    <div>
                        <span>
                        Transaction Status: 
                        <span className="txId">
                            <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank">{txId?.slice(0,8)}...</a>
                        </span>
                            <kbd>Sealed</kbd>
                            <br />
                            <small>Transaction Complete. At this point the transaction result has been committed to the blockchain.</small>
                        </span>
                    <progress min="0" max="100" value="100">Sealing!</progress>
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
        return <></>
      }
    }


export default Transaction;