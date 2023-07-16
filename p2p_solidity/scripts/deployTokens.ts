import { ethers } from "hardhat";
import { MSUSDCToken__factory, SKUSDCToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();
import { showThrottleMessage } from "@ethersproject/providers";
dotenv.config();
const address = "";

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    console.log(`Using the wallet address: ${wallet.address}`)

    const provider = new ethers.EtherscanProvider("sepolia", process.env.ETHERSCAN_API_KEY);
    //const provider=new ethers.providers.AlchemyProvider("sepolia", process.env.ALCHEMY_API_KEY);
    //const lastBlock = await provider.getBlock("latest");
    //console.log("  The last block is", lastBlock);
    const signer = wallet.connect(provider);
    const musdcFactory = new MSUSDCToken__factory(signer);
    const susdcFactory = new SKUSDCToken__factory(signer);
    

    const musdcContract = await musdcFactory.deploy();
    await musdcContract.waitForDeployment(); 
    const susdcContract = await susdcFactory.deploy();
    await susdcContract.waitForDeployment();
    console.log("musdcTokenContract Contract Address:", await musdcContract.getAddress());
    console.log("susdtTokenContract Contract Address:", await susdcContract.getAddress());
  
    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});