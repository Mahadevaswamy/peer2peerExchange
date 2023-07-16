
import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import { P2p__factory } from "../typechain-types";
import * as fs from 'fs';

dotenv.config();
import { showThrottleMessage } from "@ethersproject/providers";
dotenv.config();
const address = "";


async function main() {

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
console.log(`Using the wallet address: ${wallet.address}`)

const provider = new ethers.EtherscanProvider("sepolia", process.env.ETHERSCAN_API_KEY);
const signer = wallet.connect(provider);
const wallet2 = new ethers.Wallet(process.env.PRIVATE_KEY_ACC2 ?? "");
console.log(`Using the wallet2 address: ${wallet2.address}`)
const provider2 = new ethers.EtherscanProvider("sepolia", process.env.ETHERSCAN_API_KEY);
const signer2 = wallet2.connect(provider2);


const musdc = fs.readFileSync('artifacts/contracts/MSUSDCToken.sol/MSUSDCToken.json', 'utf-8');
const musdcAbi = JSON.parse(musdc).abi;
const musdcContract = new ethers.Contract("0x66699F1B8af40473Eac60aE9De0F81dCa222c3aC", musdcAbi, signer);
console.log("musdcContract Address:", await musdcContract.getAddress());

const susdc = fs.readFileSync('artifacts/contracts/SKUSDCToken.sol/SKUSDCToken.json', 'utf-8');
const susdcAbi = JSON.parse(susdc).abi;
const susdcContract = new ethers.Contract("0x96d8c18148223f42e1626b3D7A732063a5B1451E", susdcAbi, signer);
console.log("susdcContract Address:", await musdcContract.getAddress());
const p2pJson = fs.readFileSync('artifacts/contracts/p2p_new.sol/p2p_new.json', 'utf-8');
const p2pAbi = JSON.parse(p2pJson).abi;
const p2pContract = new ethers.Contract("0x6a8411f6eA41fF18123d48C93F04f4aEB46042CC", p2pAbi, signer);
console.log("p2p Contract Address:", await p2pContract.getAddress());


const approveMUSDCTxn=   await musdcContract.connect(signer2).approve(p2pContract.getAddress(), 20)
await approveMUSDCTxn.wait();
console.log("approveTxn", await approveMUSDCTxn.hash);

const approveSUSDCTxn=   await susdcContract.connect(signer2).approve(p2pContract.getAddress(), 20)
await approveSUSDCTxn.wait();
console.log("approveTxn", await approveSUSDCTxn.hash);

// const whiteListMUSDCTx = await p2pContract.whitelistToken("MUSDC", musdcContract.getAddress());
// await whiteListMUSDCTx.wait();
// console.log("whiteListMUSDCTx:", whiteListMUSDCTx.hash);

// const whiteListSUSDCTx = await p2pContract.whitelistToken("SUSDC", susdcContract.getAddress());
// await whiteListSUSDCTx.wait();
// console.log("whiteListSUSDCTx:", whiteListSUSDCTx.hash);
// const depositTxn = await p2pContract.connect(signer2).postSellOrder(signer2.address, "SUSDC", 10, "MUSDC", 2);
//     await depositTxn.wait();
//     console.log("Deposit completed: ", depositTxn.hash);
    const deposit2Txn = await p2pContract.connect(signer2).postSellOrder(signer2.address, "MUSDC", 15, "SUSDC",10);
    await deposit2Txn.wait();
    console.log("Deposit completed: ", deposit2Txn.hash);
    // const withdrawalTxn = await p2pContract.withdrawSellOrder(1);
    // await withdrawalTxn.wait();
   


const sellOrders = await p2pContract.getSellOrders();
    console.log("Sell orders ", sellOrders)

// const tokenAddress=p2pContract.getWhiteListedTokens("MUSDC");
// console.log("MUSDC whitelisted address:", tokenAddress);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});