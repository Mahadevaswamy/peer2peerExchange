import { Injectable } from '@nestjs/common';
import{Contract, ethers} from "ethers";
import * as p2p from "./assets/p2p.json";
import { ConfigService } from '@nestjs/config';
import { SellDto } from './dtos/SellDto';
import { SellerListDto } from './dtos/SellerListDto';
import {ResponseDto} from './dtos/ResponseDto';
import {BuyOrderDto} from './dtos/BuyOrderDto';
import * as msusdc from "./assets/msusdc.json";
import * as skusdc from "./assets/skusdc.json";
import { withdrawDto } from './dtos/withdrawDto';

@Injectable()
export class AppService {

   provider: ethers.providers.BaseProvider ;
   apiKey: string;
   signer: ethers.Wallet;
   signer2: ethers.Wallet;
   p2pContract: ethers.Contract;
   msContract: ethers.Contract;
   skContract: ethers.Contract;
   p2pAddress: string;

   constructor(private configService: ConfigService){
    this.apiKey=this.configService.get<string>('ETHERSCAN_API_KEY');
    this.provider= new ethers.providers.EtherscanProvider('sepolia',this.apiKey);
   //  this.provider = ethers.getDefaultProvider("sepolia");
     const pkey=this.configService.get<string>('PRIVATE_KEY');
    const wallet=new ethers.Wallet(pkey);
    this.signer=wallet.connect(this.provider);

    const pkey2=this.configService.get<string>('SIGNER2_PK');
    const wallet2=new ethers.Wallet(pkey2);
    this.signer2=wallet2.connect(this.provider);

    this.p2pAddress = this.configService.get<string>('P2PADDRESS');
    this.p2pContract = new Contract(this.configService.get<string>('P2PADDRESS'), p2p.abi, this.provider);
    this.msContract = new Contract(this.configService.get<string>('MUSDCCONTRACT'), msusdc.abi, this.provider);
    this.skContract = new Contract(this.configService.get<string>('SUSDCCONTRACT'), skusdc.abi, this.provider);
   }
  getHello(): string {
    return 'Hello World!';
  }

  getLastBlock(): Promise<ethers.providers.Block> {

   return this.provider.getBlock("latest");
  }

  async getTransactionReceipt(hash: string){
    const tx= await this.provider.getTransaction(hash);
    const receipt=await tx.wait();
     return receipt;
  }


  async sellToken(sellDto : SellDto){ 
    var localSigner:ethers.Wallet;
    if(sellDto.address==this.signer.address){
      localSigner = this.signer;
    } else if(sellDto.address==this.signer2.address){
      localSigner = this.signer2;
    }
    if(sellDto.token=="MUSDC"){
      const approveTxn=   await this.msContract.connect(localSigner).approve(this.p2pAddress, sellDto.amount);
      await approveTxn.wait();
    }
    else if(sellDto.token=="SUSDC"){
      const approveTxn=   await this.skContract.connect(localSigner).approve(this.p2pAddress, sellDto.amount);
      await approveTxn.wait();
    }
    const returnVal = await this.p2pContract.connect(localSigner).postSellOrder(sellDto.address,sellDto.token,sellDto.amount,sellDto.exchangeToken,sellDto.unitAmount);
    console.log(returnVal);
    var txn= await this.getTransactionReceipt(returnVal.hash);
    var response:ResponseDto = new ResponseDto();
     if(txn.status ==1){
        response.status="Success";
     }
     else if(txn.status==0)
     {
        response.status="Failure";
     }
     response.data= "https://sepolia.etherscan.io/tx/"+returnVal.hash;
    return response;
  }

   async displayList(){
     const returnVal = await this.p2pContract.connect(this.signer).getSellOrders();
     console.log(returnVal);
     console.log(returnVal[0].availableTokens.toNumber());
     var response:ResponseDto = new ResponseDto();
     var sellersList:SellerListDto[] = new Array();
     if(returnVal.length>0){
      
    
      for(var i=0; i<returnVal.length; i++){
        if(returnVal[i].availableTokens.toNumber()!=0){
          var seller = {token: returnVal[i].tokenId.toString() , address: returnVal[i].sellerAddress,
           amount:returnVal[i].availableTokens.toNumber(),requestId:returnVal[i].sellOrderId.toNumber(),
           exchangeToken: returnVal[i].exchangeToken.toString(), unitAmount: returnVal[i].pricePerToken.toNumber()};
           sellersList.push(seller);
          }
      }
    }
    if(sellersList.length>0){
      response.status="Success";
      response.data=sellersList; 
      return response; 
     }
     else{
      response.status="Failure";
      response.data="No tokens Listed";
     }
    
   } 

   async displayListForToken(token: string){
    return this.p2pContract.getSellersListForToken(token);
   }

   async processBuyOrder(procssOrderDto: BuyOrderDto){
    console.log("Inside Buy order");
    console.log(procssOrderDto);
    var localSigner:ethers.Wallet;
    if(procssOrderDto.address==this.signer.address){
      localSigner = this.signer;
    } else if(procssOrderDto.address==this.signer2.address){
      localSigner = this.signer2;
    }
    if(procssOrderDto.tokenId=="MUSDC"){
      const approveTxn=   await this.msContract.connect(localSigner).approve(this.p2pAddress, procssOrderDto.amount);
      await approveTxn.wait();
    }
    else if(procssOrderDto.tokenId=="SUSDC"){
      const approveTxn=   await this.skContract.connect(localSigner).approve(this.p2pAddress, procssOrderDto.amount);
      await approveTxn.wait();
    }
      const returnVal = await this.p2pContract.connect(localSigner).processBuyOrder(procssOrderDto.address,procssOrderDto.sellOrderID,procssOrderDto.tokenId,procssOrderDto.amount);
      console.log(returnVal);
      var txn= await this.getTransactionReceipt(returnVal.hash);
      var response:ResponseDto = new ResponseDto();
       if(txn.status ==1){
          response.status="Success";
       }
       else if(txn.status==0)
       {
          response.status="Failure";
       }
       response.data= "https://sepolia.etherscan.io/tx/"+returnVal.hash;
      return response;
   }

   async getMyListings(address:string){
    const returnVal = await this.p2pContract.connect(this.signer).getSellOrders();
     console.log("Inside getmylistings "+address);
     console.log(returnVal[0].availableTokens.toNumber());
     var response:ResponseDto = new ResponseDto();
     var sellersList:SellerListDto[] = new Array();
     if(returnVal.length>0){
      
    
      for(var i=0; i<returnVal.length; i++){
        if(returnVal[i].availableTokens.toNumber()!=0&& returnVal[i].sellerAddress==address){
          var seller = {token: returnVal[i].tokenId.toString() , address: returnVal[i].sellerAddress,
           amount:returnVal[i].availableTokens.toNumber(),requestId:returnVal[i].sellOrderId.toNumber(),
           exchangeToken: returnVal[i].exchangeToken.toString(), unitAmount: returnVal[i].pricePerToken.toNumber()};
           sellersList.push(seller);
          }
      }
    }
    if(sellersList.length>0){
      response.status="Success";
      response.data=sellersList; 
      return response; 
     }
     else{
      response.status="Failure";
      response.data="No tokens Listed";
     }
    
   } 
  async withdraw(withdraw:withdrawDto){
      console.log("Inside withdraw");
      var localSigner:ethers.Wallet;
      if(withdraw.address==this.signer.address){
        localSigner = this.signer;
      } else if(withdraw.address==this.signer2.address){
        localSigner = this.signer2;
      }
    var returnVal= await this.p2pContract.connect(localSigner).withdrawSellOrder(withdraw.sellOrderID);
    console.log(returnVal);
    var txn= await this.getTransactionReceipt(returnVal.hash);
    var response:ResponseDto = new ResponseDto();
     if(txn.status ==1){
        response.status="Success";
     }
     else if(txn.status==0)
     {
        response.status="Failure";
     }
     response.data= "https://sepolia.etherscan.io/tx/"+returnVal.hash;
    return response;
  }   

}
