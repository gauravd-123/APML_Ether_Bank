import { useState } from 'react';
 import { ethers } from 'ethers';

import './App.css';

import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/token.sol/Token.json'

const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const tokenAddress =  "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"

function App() {
  const [greeting, setGreetingValue] = useState('')
  const [userAccount, setUserAccount] = useState('')
  const [amount, setAmount] = useState(0)

  async function requestAccount(){
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function getBalance() {
      if (typeof window.ethereum !== 'undefined') {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
        const balance = await contract.balanceOf(account);
        console.log("Balance: ", balance.toString());
      }
    }

    async function sendCoins() {
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
        const transaction = await contract.transfer(userAccount, amount);
        await transaction.wait();
        console.log(`${amount} Coins successfully sent to ${userAccount}`);
      }
    }

    async function fetchGreeting(){
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          // console.log({ provider })
          const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
          try {
            const data = await contract.greet()
            console.log('data: ', data)
          } catch (err) {
            console.log("Error: ", err)
          }
        }
      }

    async function setGreeting(){
        if (!greeting) return
        if (typeof window.ethereum !== 'undefined') {
          await requestAccount()
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          console.log({ provider })
          const signer = provider.getSigner()
          const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
          const transaction = await contract.setGreeting(greeting)
          // setGreetingValue('')
          await transaction.wait()
          // fetchGreeting()
        }
      }


  return (
    
    <div className="App">
      <header className="App-header">
        
        <h1>APML ETHER BANK</h1>
        <br/>
        <h2>Set a message for User:</h2>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
        <button onClick={setGreeting}>Set Greeting</button>
        <br />
        <br />
        
        <h2>Check Balance & Send Coins:</h2>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <button className='btn1' onClick={getBalance}>Get Balance</button>
        <button className='btn2' onClick={sendCoins}>Send Coins</button>
      </header>
    </div>
  );
}

export default App