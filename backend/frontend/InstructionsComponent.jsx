import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { useSigner, useNetwork, useBalance } from "wagmi";
import { useState, useEffect } from 'react';

export default function InstructionsComponent() {
	const router = useRouter();
	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h2>
					Group2 dApp
				</h2>
			</header>
			<div className={styles.buttons_container}>
		
				<PageBody></PageBody>
			</div>

			<div className={styles.buttons_container}>
			</div>
			<div className={styles.footer}>
				Group2 - Week4 assignment
			</div>
		</div>
	);
}

function PageBody(){
	return (
		<div>
		<WalletInfo></WalletInfo>
		<br/>
		<RequestToken></RequestToken>
		<br/>
		<SignerAddress></SignerAddress>
		<br/>
		<ContractAddress></ContractAddress>
		<br/>
		<TotalSupply></TotalSupply>
		<br/>
		<br/>
		<BalanceofAddress></BalanceofAddress>
		<br/>
		<br/>
		<Delegate></Delegate>
		<br/><br/>
		<Vote></Vote>
		<br/><br/>
		<WinnerName></WinnerName>

		</div>
	)
}


function WalletInfo(){
	const{ data: signer, isError, isLoading } = useSigner();
	const { chain, chains } = useNetwork();
	if (signer)	return (
		<div>
			<p> Your account address is {signer._address}</p>
			<p> Connected to {chain.name}</p><br/>
			<button onClick={()=>SignMessage(signer,"My name is Sudarshan")}>Sign</button>
			<WalletBalance></WalletBalance>
		</div>
	)
	if (isLoading) return (
		<>
		<p>Loading</p>
		</>
	)
	return(
		<>
		<p>Connect account to continue</p>
		</>
	)
}

function SignMessage(signer, message){
signer.signMessage(message).then(
	(signature) => {"signed"+console.log(signature)},
	(error)=> {"ERROR"+console.error(error)} )

}

function WalletBalance(){
	const{ data: signer } = useSigner();

	const { data, isError, isLoading } = useBalance({
		address: signer._address,
	  })
	 
	  if (isLoading) return <div>Fetching balance…</div>
	  if (isError) return <div>Error fetching balance</div>
	  return (
		<div>
			<br/>
		  Balance: {data?.formatted} {data?.symbol}
		</div>
	  )
}


function ApiInfo(){
	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	
	useEffect(() => {
		setLoading(true);
		fetch('/api/profile-data')
		.then((res) => res.json())
		.then((data) => {
			setData(data);
			setLoading(false);
		});
	}, []);
	
	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No profile data</p>;
	
	return (
		<div>
		<h1>{data.name}</h1>
		<p>{data.bio}</p>
		</div>
	);
}

function SignerAddress(){
	const [walletData, setWalletData] = useState(null);
	
	if(walletData) return(
		<div>
			<p>Address is {walletData}</p>
		</div>
	)
	return(
		<div>
			<button onClick={()=>getWalletAddress(setWalletData)}> Signer Address </button>
		</div>
	)
}

function getWalletAddress(setWalletData){
	fetch('http://localhost:3001/signerAddress')
	.then(
		response => response.text())
	.then((data)=>{
		setWalletData(data);
	});

}


/// contract data

function ContractAddress(){
	const [contractData, setContractData] = useState(null);
	
	if(contractData) return(
		<div>
			<p>Contract Address is  {contractData}</p>
		</div>
	)
	return(
		<div>
			<button onClick={()=>getContractAddress(setContractData)}> Contract Address</button>
		</div>
	)
}

function getContractAddress(setContractData){
	fetch('http://localhost:3001/contract-address')
	.then(
		response => response.text())
	.then((data)=>{
		setContractData(data);
	});

}


//total-supply

function TotalSupply(){
	const [totalSupply, setTotalSupply] = useState(null);
	
	if(totalSupply) return(
		<div>
			<p>Total Supply is  {totalSupply}</p>
		</div>
	)
	return(
		<div>
			<button onClick={()=>getTotalSupply(setTotalSupply)}> Total Supply</button>
		</div>
	)
}

function getTotalSupply(setTotalSupply){
	fetch('http://localhost:3001/total-supply')
	.then(
		response => response.json())
	.then((data)=>{
		setTotalSupply(parseInt(data.hex,16));
	});

}

//Delegate

function Delegate(){
	const [deldata, setData] = useState(null);
	
	if(deldata) return(
		<div>
			<p>Delegated Successfully</p>
		</div>
	)
	return(
		<div>
		<form>
			<label htmlFor="Address">Delegate to: </label>
			<input type="text" id="delegateTo" name="delegateTo" />
			<button onClick={() =>delegateFunction(setData)}>Delegate</button>
		</form>
		</div>
	)
}

function delegateFunction(setData){
	const addressb = document.getElementById("AddressforBalance").value;
	var delegate = new String(addressb); 
	fetch('http://localhost:3001/delegate?delegate='+delegate)
	.then(
		response => response.json())
	.then((data)=>{
		setData(data);
	});

}

//Balance of
function BalanceofAddress(){
	const [balance, setBalance] = useState(null);
	
	if(balance) return(
		<div>
			<p>Balance of Address is </p>
		</div>
	)
	return(
	<div>
		<form>
			<label htmlFor="Address">Input Address to fetch Balance</label>
			<input type="text" id="AddressforBalance" name="AddressforBalance" />
			<button onClick={() =>getBalanceofAddress(setBalance)}>Fetch Balance</button>
		</form>
	</div>
	)
}

async function  getBalanceofAddress(setBalance){
	const addressb = document.getElementById("AddressforBalance").value;
 	var url = new String("http://localhost:3001/balance-of?"); 
	var addressString = new String(addressb);
	var finalUrl = url.concat(addressString);

	
	fetch(finalUrl)
 	.then(
		response => response.json())
	.then((data)=>{
		setBalance(data);
	});
 
}

//Request token
function RequestToken(){
	const {data: signer} = useSigner();
	const [txData, setTxData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	if(txData) return (
		<div>
			<p>Transaction Completed!</p>
			<a href={"https://sepolia.etherscan.io/tx/"+txData.hash}  target = "_blank"></a>
		</div>
	)
	if(isLoading) return <p>Requesting tokens to be minted...</p>

	return(
		<div>
			<button onClick={()=>requestTokens(signer,"2",setLoading,setTxData)}> Request Tokens</button>
		</div>
	)
}

function requestTokens(signer, signature, setLoading, setTxData){
	setLoading(true);
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({address: signer._address, tokens: signature})

	};
	fetch('http://localhost:3001/request-tokens', requestOptions)
	.then(
		response => response.json())
	.then((data)=>{
		setTxData(data);
		setLoading(true);
	});

}

//Vote

function Vote(){
	const [voteData, setVoteData] = useState(null);

	if(voteData) return (
		<div>
			<p>Voting Completed!</p>
		</div>
	)

	return(
		<div>
			<form>
				<label htmlFor="PorposalId">Input Porposal ID</label>
				<input type="text" id="proposalId" name="proposalId" />
				<label htmlFor="votes">No of votes</label>
				<input type="text" id="voteNum" name="voteNum" />
				<button onClick={() =>voteContract(setVoteData)}>Vote</button>
			</form>
		
		</div>
	)
}

async function voteContract(setVoteData){
	var pId = new String(document.getElementById("proposalId").value);
	var votes = new String(document.getElementById("voteNum").value);
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({proposalNo: pId, votes: votes})

	};
	fetch('http://localhost:3001/vote', requestOptions)
	.then(
		response => response.status)
	.then((data)=>{
		setVoteData(data);
	}); 
	
}

//Winnername
function WinnerName(){
	const [winnerData, setData] = useState(null);

	if(winnerData) return (
		<div>
			<p>Winner is {winnerData}</p>
		</div>
	)

	return(
		<div>
			<button onClick={()=>fetchWinnerName(setData)}> Get Winner Name</button>
		</div>
	)
}

async function fetchWinnerName(setData){

	fetch('http://localhost:3001/winnerName')
	.then(
		response => response.status)
	.then((data)=>{
		setData(data);
	}); 
}