import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();
import { showThrottleMessage } from "@ethersproject/providers";
dotenv.config();
const address="";


async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  console.log(`Using the wallet address: ${wallet.address}`)

  const provider = new ethers.EtherscanProvider("sepolia", process.env.ETHERSCAN_API_KEY);
  //const provider=new ethers.providers.AlchemyProvider("sepolia", process.env.ALCHEMY_API_KEY);
  //const lastBlock = await provider.getBlock("latest");
  //console.log("  The last block is", lastBlock);
  const signer = wallet.connect(provider);
  const wallet2 = new ethers.Wallet(process.env.PRIVATE_KEY_ACC2 ?? "");
  console.log(`Using the wallet2 address: ${wallet2.address}`)

  const provider2 = new ethers.EtherscanProvider("sepolia", process.env.ETHERSCAN_API_KEY);

  const signer2 = wallet2.connect(provider2);


  const musdc = fs.readFileSync('artifacts/contracts/MSUSDCToken.sol/MSUSDCToken.json', 'utf-8');
  const musdcAbi = JSON.parse(musdc).abi;
  const musdcContract = new ethers.Contract("0x66699F1B8af40473Eac60aE9De0F81dCa222c3aC", musdcAbi, signer);
  console.log("p2p Contract Address:", await musdcContract.getAddress());

  const susdc = fs.readFileSync('artifacts/contracts/SKUSDCToken.sol/SKUSDCToken.json', 'utf-8');
  const susdcAbi = JSON.parse(susdc).abi;
  const susdcContract = new ethers.Contract("0x96d8c18148223f42e1626b3D7A732063a5B1451E", susdcAbi, signer);
  console.log("p2p Contract Address:", await susdcContract.getAddress());

  console.log("musdcTokenContract Contract Address:", await musdcContract.getAddress());
    console.log("susdtTokenContract Contract Address:", await susdcContract.getAddress());
    const mintmusdcTx = await musdcContract
    .connect(signer)
    .mint("0xaD57E1d8C0C0272954DC37940c8e1b4d5c4aB9bf", 100);
    await mintmusdcTx.wait();
    console.log("musdc Mint tx:", mintmusdcTx.hash);
    const mintsusdcTx = await susdcContract
    .connect(signer)
    .mint("0xaD57E1d8C0C0272954DC37940c8e1b4d5c4aB9bf", 100);
    await mintsusdcTx.wait();
    console.log("susdc Mint tx:", mintsusdcTx.hash);
 }

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });