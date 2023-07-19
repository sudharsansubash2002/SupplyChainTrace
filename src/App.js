// Importing modules
import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
import "./App.css";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Types, AptosClient } from 'aptos';
// import {tokenaddress1,abi1,tokenaddress2,abi2,stakingaddress,abi3} from "./abi";
// import web3 from "./web3";
import {useRef} from "react";
import { Provider, Network } from "aptos";



function App() {

	const provider = new Provider(Network.TESTNET);

// usetstate for storing and retrieving wallet details
const [data, setdata] = useState({
	address: "",
	Balance: null,
});

const [curr_Item, setCurr_Item] = useState();
const [account, setAccount] = useState("");
const [count,setCount] = useState(0);

const inputamt=useRef(null);


//petra wallet
const getAptosWallet = () => {
  if ('aptos' in window) {
    return window.aptos;
  } else {
    window.open('https://petra.app/', `_blank`);
  }
};

const wallet = getAptosWallet();
const Walletconnect = async() => { 
	try {
  const response = await wallet.connect();
  console.log(response); // { address: string, address: string }

  const account1 = await wallet.account();
  setAccount(account1)
  console.log(account); // { address: string, address: string }

  console.log("wallet connected successfully")
} catch (error) {
  // { code: 4001, message: "User rejected the request."}
  console.log("ERROR");
}
}

const Disconnect = async() => {
	const res = await wallet.disconnect();
	console.log(res);
}

const fetchItemCount = async() =>{
	try {
		const count1 = await provider.getAccountResource(
		"0xe1251d8d0c6af0510153cc972653ccee963222d662dccdcc604444402f6903ce",
		`0xe1251d8d0c6af0510153cc972653ccee963222d662dccdcc604444402f6903ce::Trace1::Count`
		);
		setCount(count1);
		// console.log(count?.data?.counts);
		} catch (error) {
		console.log("error")
		}
		}

const generate_item = async () => {
	const transaction = {
	type: "entry_function_payload",
	function: `0xe1251d8d0c6af0510153cc972653ccee963222d662dccdcc604444402f6903ce::Trace1::generate_item`,
	arguments: [],
	type_arguments: [],
	};
	try {
	const pendingTransaction = await (window).aptos.signAndSubmitTransaction(transaction);
	console.log("pendingTransaction", pendingTransaction);
	const client = new AptosClient('https://testnet.aptoslabs.com');
	client.waitForTransaction(pendingTransaction.hash);
	fetchItemCount();
	console.log("calculated");
	} catch (error) {
		console.log("error");
	}
	}

const fetchitem1 = async() =>{
try {
	const curr_Item1 = await provider.getAccountResource(
	"0xe1251d8d0c6af0510153cc972653ccee963222d662dccdcc604444402f6903ce",
	`0xe1251d8d0c6af0510153cc972653ccee963222d662dccdcc604444402f6903ce::Trace1::Cur_item`
	);
	setCurr_Item(curr_Item1);
	console.log(curr_Item1?.data?.item_id)
	} catch (error) {
	console.log("error")
	}
	}


const display_item = async () => {
	const transaction = {
	type: "entry_function_payload",
	function: `0xe1251d8d0c6af0510153cc972653ccee963222d662dccdcc604444402f6903ce::Trace1::display_item`,
	arguments: [inputamt.current.value - 1],
	type_arguments: [],
	};
	try {
	const pendingTransaction = await (window).aptos.signAndSubmitTransaction(transaction);
	console.log("pendingTransaction", pendingTransaction);
	const client = new AptosClient('https://testnet.aptoslabs.com');
	client.waitForTransaction(pendingTransaction.hash);
	console.log("calculated");
	fetchitem1();
	} catch (error) {
	console.log("error");
	}
	}

	useEffect(() => {
		fetchItemCount();
	  },[]);
 
	

return (
	<div className="App">
	{/* Calling all values which we
	have stored in usestate */}

	<Card className="text-center">
		<Card.Header>
		<strong>Address: </strong>
		{data.address}
		</Card.Header>
		<Card.Body>
		<Card.Text>
			<strong>Balance: </strong>
			{data.Balance}
		</Card.Text>
		<h2>Item_Count:{count?.data?.counts}</h2>
		<br/><br/>
		<Button onClick={Walletconnect} variant="primary">
			Connect to wallet
		</Button>
		<br/>
		<br/>
		<Button onClick={Disconnect} variant="primary">
			DisConnect
		</Button>
		<br/>
		<br/>

		<Button onClick={generate_item} variant="primary">
			add item
		</Button>
		<br/>
		<br/>
		
		<label>item no:</label>&nbsp;&nbsp;<input ref={inputamt}
        type="text"
        id="amt1"
        name="amt1"/>&nbsp;&nbsp;
		
		<br/>
		<br/>
		<Button onClick={display_item} variant="primary">
			display
		</Button>

		<br/>
		<br/>
		<h2>{curr_Item?.data?.item_key}</h2><br/><br/>
		<img src={`https://qrickit.com/api/qr.php?d=${curr_Item?.data?.item_key}`} alt=""/>
		
		
		
		</Card.Body>
	</Card>
	</div>
);

}
export default App;

