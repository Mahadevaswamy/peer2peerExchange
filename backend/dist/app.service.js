"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const p2p = require("./assets/p2p.json");
const config_1 = require("@nestjs/config");
const ResponseDto_1 = require("./dtos/ResponseDto");
const msusdc = require("./assets/msusdc.json");
const skusdc = require("./assets/skusdc.json");
let AppService = exports.AppService = class AppService {
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('ETHERSCAN_API_KEY');
        this.provider = new ethers_1.ethers.providers.EtherscanProvider('sepolia', this.apiKey);
        const pkey = this.configService.get('PRIVATE_KEY');
        const wallet = new ethers_1.ethers.Wallet(pkey);
        this.signer = wallet.connect(this.provider);
        const pkey2 = this.configService.get('SIGNER2_PK');
        const wallet2 = new ethers_1.ethers.Wallet(pkey2);
        this.signer2 = wallet2.connect(this.provider);
        this.p2pAddress = this.configService.get('P2PADDRESS');
        this.p2pContract = new ethers_1.Contract(this.configService.get('P2PADDRESS'), p2p.abi, this.provider);
        this.msContract = new ethers_1.Contract(this.configService.get('MUSDCCONTRACT'), msusdc.abi, this.provider);
        this.skContract = new ethers_1.Contract(this.configService.get('SUSDCCONTRACT'), skusdc.abi, this.provider);
    }
    getHello() {
        return 'Hello World!';
    }
    getLastBlock() {
        return this.provider.getBlock("latest");
    }
    async getTransactionReceipt(hash) {
        const tx = await this.provider.getTransaction(hash);
        const receipt = await tx.wait();
        return receipt;
    }
    async sellToken(sellDto) {
        var localSigner;
        if (sellDto.address == this.signer.address) {
            localSigner = this.signer;
        }
        else if (sellDto.address == this.signer2.address) {
            localSigner = this.signer2;
        }
        if (sellDto.token == "MUSDC") {
            const approveTxn = await this.msContract.connect(localSigner).approve(this.p2pAddress, sellDto.amount);
            await approveTxn.wait();
        }
        else if (sellDto.token == "SUSDC") {
            const approveTxn = await this.skContract.connect(localSigner).approve(this.p2pAddress, sellDto.amount);
            await approveTxn.wait();
        }
        const returnVal = await this.p2pContract.connect(localSigner).postSellOrder(sellDto.address, sellDto.token, sellDto.amount, sellDto.exchangeToken, sellDto.unitAmount);
        console.log(returnVal);
        var txn = await this.getTransactionReceipt(returnVal.hash);
        var response = new ResponseDto_1.ResponseDto();
        if (txn.status == 1) {
            response.status = "Success";
        }
        else if (txn.status == 0) {
            response.status = "Failure";
        }
        response.data = "https://sepolia.etherscan.io/tx/" + returnVal.hash;
        return response;
    }
    async displayList() {
        const returnVal = await this.p2pContract.connect(this.signer).getSellOrders();
        console.log(returnVal);
        console.log(returnVal[0].availableTokens.toNumber());
        var response = new ResponseDto_1.ResponseDto();
        var sellersList = new Array();
        if (returnVal.length > 0) {
            for (var i = 0; i < returnVal.length; i++) {
                if (returnVal[i].availableTokens.toNumber() != 0) {
                    var seller = { token: returnVal[i].tokenId.toString(), address: returnVal[i].sellerAddress,
                        amount: returnVal[i].availableTokens.toNumber(), requestId: returnVal[i].sellOrderId.toNumber(),
                        exchangeToken: returnVal[i].exchangeToken.toString(), unitAmount: returnVal[i].pricePerToken.toNumber() };
                    sellersList.push(seller);
                }
            }
        }
        if (sellersList.length > 0) {
            response.status = "Success";
            response.data = sellersList;
            return response;
        }
        else {
            response.status = "Failure";
            response.data = "No tokens Listed";
        }
    }
    async displayListForToken(token) {
        return this.p2pContract.getSellersListForToken(token);
    }
    async processBuyOrder(procssOrderDto) {
        console.log("Inside Buy order");
        console.log(procssOrderDto);
        var localSigner;
        if (procssOrderDto.address == this.signer.address) {
            localSigner = this.signer;
        }
        else if (procssOrderDto.address == this.signer2.address) {
            localSigner = this.signer2;
        }
        if (procssOrderDto.tokenId == "MUSDC") {
            const approveTxn = await this.msContract.connect(localSigner).approve(this.p2pAddress, procssOrderDto.amount);
            await approveTxn.wait();
        }
        else if (procssOrderDto.tokenId == "SUSDC") {
            const approveTxn = await this.skContract.connect(localSigner).approve(this.p2pAddress, procssOrderDto.amount);
            await approveTxn.wait();
        }
        const returnVal = await this.p2pContract.connect(localSigner).processBuyOrder(procssOrderDto.address, procssOrderDto.sellOrderID, procssOrderDto.tokenId, procssOrderDto.amount);
        console.log(returnVal);
        var txn = await this.getTransactionReceipt(returnVal.hash);
        var response = new ResponseDto_1.ResponseDto();
        if (txn.status == 1) {
            response.status = "Success";
        }
        else if (txn.status == 0) {
            response.status = "Failure";
        }
        response.data = "https://sepolia.etherscan.io/tx/" + returnVal.hash;
        return response;
    }
    async getMyListings(address) {
        const returnVal = await this.p2pContract.connect(this.signer).getSellOrders();
        console.log("Inside getmylistings " + address);
        console.log(returnVal[0].availableTokens.toNumber());
        var response = new ResponseDto_1.ResponseDto();
        var sellersList = new Array();
        if (returnVal.length > 0) {
            for (var i = 0; i < returnVal.length; i++) {
                if (returnVal[i].availableTokens.toNumber() != 0 && returnVal[i].sellerAddress == address) {
                    var seller = { token: returnVal[i].tokenId.toString(), address: returnVal[i].sellerAddress,
                        amount: returnVal[i].availableTokens.toNumber(), requestId: returnVal[i].sellOrderId.toNumber(),
                        exchangeToken: returnVal[i].exchangeToken.toString(), unitAmount: returnVal[i].pricePerToken.toNumber() };
                    sellersList.push(seller);
                }
            }
        }
        if (sellersList.length > 0) {
            response.status = "Success";
            response.data = sellersList;
            return response;
        }
        else {
            response.status = "Failure";
            response.data = "No tokens Listed";
        }
    }
    async withdraw(withdraw) {
        console.log("Inside withdraw");
        var localSigner;
        if (withdraw.address == this.signer.address) {
            localSigner = this.signer;
        }
        else if (withdraw.address == this.signer2.address) {
            localSigner = this.signer2;
        }
        var returnVal = await this.p2pContract.connect(localSigner).withdrawSellOrder(withdraw.sellOrderID);
        console.log(returnVal);
        var txn = await this.getTransactionReceipt(returnVal.hash);
        var response = new ResponseDto_1.ResponseDto();
        if (txn.status == 1) {
            response.status = "Success";
        }
        else if (txn.status == 0) {
            response.status = "Failure";
        }
        response.data = "https://sepolia.etherscan.io/tx/" + returnVal.hash;
        return response;
    }
};
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map