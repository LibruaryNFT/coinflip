import '../App.css';
import '../dist/output.css';


import {useEffect, useState, useRef} from 'react';
import GraffleSDK from '@graffle/flow-livestream-sdk';
import axios from "axios";


function PreviousCoinFlips(props) {
  
  // graffle
  const [eventsData, setEventsData] = useState([]);

  const clientConfig = {
    projectId: '041706f7-3ded-4e39-9697-87544103a856',
    apiKey: 'dd6325db33b24f21bb99ae520485cd41'
  };

  // or `const streamSDK = new GraffleSDK(clientConfig);` for main net
  const streamSDK = new GraffleSDK(clientConfig, true);

  useEffect(() => {
    const getEvents = async () => {
        // console.log("getSales fired")
        let data
        let res = await axios
            .get("https://prod-test-net-dashboard-api.azurewebsites.net/api/company/6fc17a55-6975-4586-b5b5-d39e7a1bec52/search?eventType=A.91b3acc974ec2f7d.Coin.CoinFlipGame")
        data = res.data
        setEventsData(data)
    }
    getEvents()
  }, [])

  console.log('eventsData', eventsData);

  return (
        
        <div>
          <div className="flex flex-col text-white font-bold bg-red-400">
            <h1 className="text-4xl text-center">Previous Results</h1>

            <table className="table-auto text-left border text-sm">
                <tbody>
                  <tr className="border">
                    <th className="border">Date</th>
                    <th className="border">Name</th>
                    <th className="border">ID</th>
                    <th className="border">Prediction</th>
                    <th className="border">Outcome</th>
                    <th className="border">Result</th>              
                  </tr>

                  {eventsData.map((item, id) => (
                    <tr key={id} className="border">
                      <td className="border">{item.eventDate.slice(5, 19).replace('T',' ')}</td>
                      <td className="border">{item.blockEventData.player.slice(2,7)}</td>
                      <td className="border">{item.blockEventData.id}</td>
                      <td className="border">{item.blockEventData.kind == 0 ? 'Heads' : 'Tails'}</td>
                      <td className="border">{item.blockEventData.coinFlip == 0 ? 'Heads' : 'Tails'}</td>
                      <td className="border"><a href={`https://testnet.flowscan.org/transaction/${item.flowTransactionId}`} target="_blank">{item.blockEventData.coinresult == 0 ? <button className="px-4 py-2 text-white rounded-full md:py-1 bg-lime-500 hover:bg-brightRedLight font-bold">Winner</button> : <button className="px-4 py-2 text-white rounded-full md:py-1 bg-red-700 hover:bg-brightRedLight font-bold">Loser</button>}</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>


              
              
          </div>
          
          
          
          

          
          
        </div>
);

  
}

export default PreviousCoinFlips;
 