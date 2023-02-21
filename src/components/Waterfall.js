import '../App.css';
import "../dist/output.css"

import SetupAccount from "./SetupAccount.js"
import CoinCollection from "./CoinCollection.js"
import CoinStore from "./CoinStore.js"
import PreviousCoinFlips from "./PreviousCoinFlips.js"


function Waterfall ({user, coincollectioncheck, txId, txInProgress,txStatus}) {
    if (user) {
            
        if (user.loggedIn == true && coincollectioncheck == true) {

            return (
                <div>
                <h1 className="text-white text-4xl text-center">Welcome {user.addr}!</h1>
                Do you feel lucky?

                <CoinCollection address={user.addr} />
                <CoinStore address="0xf788ae5c7ec2d1ae"/> 
                <PreviousCoinFlips/> 

            </div>

            )
        }

        else if (user.loggedIn == true && coincollectioncheck == false) {
            return (
            <SetupAccount/>

            )
        }

        else if (user.loggedIn != true) {
            return (
            <div>
            <h1 className="text-white text-4xl text-center">Welcome traveler!</h1>
            Yes, the tales are true, I am the Waterfall of Luck.. <br></br>
            and luckily for you I can speak English!

            <div className="font-bold"><br></br>I want to have some fun with you, but first I'd like to get to know who you are. <br></br>Please identify yourself! <br></br>Legends say there might be a big button that says 'Connect Character'. Also, I know I am friendly to those from the land of BloctoWallet, but unsure about others.. </div>
        </div>
        )
        }
    
    }

    else if (txInProgress && txStatus < 0 ) {
        return (
        <div>Waterfall: Transaction Status: Initializing</div>
        )
    }

    else if (txInProgress && txStatus < 2 ) {
        return (
        <div>Waterfall: Transaction Status: Pending</div> 
        )

    }

    else if (txInProgress && txStatus == 2 ) {
        return (
        <div>Waterfall: Transaction Status: Finalized</div> 
        )

    }

    else if (txInProgress && txStatus == 3 ) {
        return (
        <div>Transaction Status: Executed</div> 
        )

    }

    else if (txInProgress && txStatus == 4 ) {
        return (
        <div>Waterfall: Transaction Status: Sealed</div> 
        )

    }
    else {
        return(
            <div>Waterfall: Nothing!</div>
        )
    }

}
  
export default Waterfall



