import React, { useEffect, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

const retelAPI = new RetellWebClient()

function App() {
  const [isCallStarted, setIsCallStarted] = useState(false)


  useEffect(() => {
    retelAPI.on("conversationEnded", convEnded => {
      setIsCallStarted(false) 
    })

    retelAPI.on("error", error => {
      setIsCallStarted(false) 
    })
  }, [])

  const onCliclStartStop =  () => {
    if (isCallStarted) {
      retelAPI.stopCall()
      setIsCallStarted(false)
    } else {
     getCallInformation()
    }
  }

 const getCallInformation=async()=> {
    try {
      const response = await fetch("https://api.retellai.com/v2/create-web-call", {
        method: 'POST', 
        headers: {
          'Authorization': 'Bearer key_b322466cd9d79928ddd88d10ed6a',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agent_id :"agent_8e8d2a877b2399c2172d19a0dc"}) 
      })
     const callInformation = await response.json()
     
     if (callInformation?.access_token) {
       await retelAPI.startCall({
        accessToken: callInformation.access_token,
      });
      setIsCallStarted(true) 
     }
      
    } catch (err) {
      throw new Error(err)
    }
  }


  return(
    <div>
      <button onClick={onCliclStartStop} >{isCallStarted  ? 'Stop':'Start'} </button>
    </div>
  )
}
export default App;