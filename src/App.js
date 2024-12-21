import React, { useEffect, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

const webClient = new RetellWebClient()

function App() {
  const [isCalling, setIsCalling] = useState(false)
  const [buttonVariant, setButtonVariant] = useState("success")
 
  const [transcript, setTranscript] = useState("")

  // Initialize the SDK
  useEffect(() => {
    // Setup event listeners
    webClient.on("conversationStarted", () => {
      console.log("conversationStarted")
    })

    webClient.on("audio", audio => {
      console.log("There is audio")
    })

    webClient.on("conversationEnded", convEnded => {
      console.log(
        "Closed with code:",
        convEnded.code,
        ", reason:",
        convEnded.reason
      )
      setIsCalling(false) // Update button to "Start" when conversation ends
    })

    webClient.on("error", error => {
      console.error("An error occurred:", error)
      setIsCalling(false) // Update button to "Start" in case of error
    })

    webClient.on("update", update => {
      update = update.transcript[update.transcript.length - 1]
      console.log("update", update.content)
      setTranscript(
        update.role == "user"
          ? "Customer: " + update.content
          : "Assistant: " + update.content
      )
    })
  }, [])

  const toggleConversation = async () => {
    if (isCalling) {
      webClient.stopCall()
      setButtonVariant("success")
      setIsCalling(false)
    } else {
      const registerCallResponse = await registerCall()
      if (registerCallResponse.call_id) {
        await webClient.startCall({
          accessToken: registerCallResponse.access_token,
        });
        setIsCalling(true) // Update button to "Stop" when conversation starts
        setButtonVariant("danger")
      }
    }
  }

  async function registerCall() {
    try {
      // Replace with your server url
      const response = await fetch("https://api.retellai.com/v2/create-web-call", {
        method: 'POST', // Specify the method as POST
        headers: {
          'Authorization': 'Bearer key_b322466cd9d79928ddd88d10ed6a', // Replace with your actual Bearer token
                    'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agent_id :"agent_8e8d2a877b2399c2172d19a0dc"}) // Convert the data object to a JSON string
      })
      console.log(response,"REP")
      let callDetails = await response.json()
      return callDetails
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }


  return(
    <div>
      <button onClick={toggleConversation} >{isCalling  ? 'Stop':'Start'} </button>
      <p>{transcript}</p>
    </div>
  )
}
export default App;