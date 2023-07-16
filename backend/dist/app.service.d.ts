import { ethers } from "ethers";
import { ConfigService } from '@nestjs/config';
import { SellDto } from './dtos/SellDto';
import { ResponseDto } from './dtos/ResponseDto';
import { BuyOrderDto } from './dtos/BuyOrderDto';
import { withdrawDto } from './dtos/withdrawDto';
export declare class AppService {
    private configService;
    provider: ethers.providers.BaseProvider;
    apiKey: string;
    signer: ethers.Wallet;
    signer2: ethers.Wallet;
    p2pContract: ethers.Contract;
    msContract: ethers.Contract;
    skContract: ethers.Contract;
    p2pAddress: string;
    constructor(configService: ConfigService);
    getHello(): string;
    getLastBlock(): Promise<ethers.providers.Block>;
    getTransactionReceipt(hash: string): Promise<ethers.providers.TransactionReceipt>;
    sellToken(sellDto: SellDto): Promise<ResponseDto>;
    displayList(): Promise<ResponseDto>;
    displayListForToken(token: string): Promise<any>;
    processBuyOrder(procssOrderDto: BuyOrderDto): Promise<ResponseDto>;
    getMyListings(address: string): Promise<ResponseDto>;
    withdraw(withdraw: withdrawDto): Promise<ResponseDto>;
}
