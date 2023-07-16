import { ethers } from "ethers";
import { AppService } from './app.service';
import { SellDto } from './dtos/SellDto';
import { BuyOrderDto } from './dtos/BuyOrderDto';
import { withdrawDto } from './dtos/withdrawDto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getLastBlock(): Promise<ethers.providers.Block>;
    getTransactionReceipt(hash: string): Promise<ethers.providers.TransactionReceipt>;
    sellToken(body: SellDto): Promise<import("./dtos/ResponseDto").ResponseDto>;
    getSellersList(): Promise<import("./dtos/ResponseDto").ResponseDto>;
    getMyListings(address: string): Promise<import("./dtos/ResponseDto").ResponseDto>;
    processBuyOrder(body: BuyOrderDto): Promise<import("./dtos/ResponseDto").ResponseDto>;
    withdraw(body: withdrawDto): Promise<import("./dtos/ResponseDto").ResponseDto>;
}
