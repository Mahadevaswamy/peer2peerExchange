
import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import { P2p_new__factory } from "../typechain-types";

dotenv.config();
dotenv.config();
const address="";


async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    console.log(`Using the wallet address: ${wallet.address}`)

    const provider = new ethers.EtherscanProvider("sepolia", process.env.ETHERSCAN_API_KEY);
    const signer = wallet.connect(provider);
    const P2pfactory = new P2p_new__factory(signer);
    

    const p2pContract = await P2pfactory.deploy();
    await p2pContract.waitForDeployment();
    console.log("p2p Contract Address:", await p2pContract.getAddress());
   
   }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });