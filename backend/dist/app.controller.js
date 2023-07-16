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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const SellDto_1 = require("./dtos/SellDto");
const BuyOrderDto_1 = require("./dtos/BuyOrderDto");
const withdrawDto_1 = require("./dtos/withdrawDto");
let AppController = exports.AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getLastBlock() {
        return this.appService.getLastBlock();
    }
    getTransactionReceipt(hash) {
        return this.appService.getTransactionReceipt(hash);
    }
    sellToken(body) {
        console.log("Inside sell method - " + body);
        return this.appService.sellToken(body);
    }
    getSellersList() {
        console.log("Fetching all Sellers");
        return this.appService.displayList();
    }
    getMyListings(address) {
        console.log("Fetching all Sellers");
        return this.appService.getMyListings(address);
    }
    processBuyOrder(body) {
        return this.appService.processBuyOrder(body);
    }
    withdraw(body) {
        return this.appService.withdraw(body);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)("last-block"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getLastBlock", null);
__decorate([
    (0, common_1.Get)("transaction-receipt/"),
    __param(0, (0, common_1.Query)('hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getTransactionReceipt", null);
__decorate([
    (0, common_1.Post)("sellToken/"),
    __param(0, (0, common_1.Body)('')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SellDto_1.SellDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "sellToken", null);
__decorate([
    (0, common_1.Get)("getAllSellers/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getSellersList", null);
__decorate([
    (0, common_1.Get)("getMyListings/"),
    __param(0, (0, common_1.Query)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getMyListings", null);
__decorate([
    (0, common_1.Post)("processBuyOrder"),
    __param(0, (0, common_1.Body)('')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BuyOrderDto_1.BuyOrderDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "processBuyOrder", null);
__decorate([
    (0, common_1.Post)("withdraw/"),
    __param(0, (0, common_1.Body)('')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [withdrawDto_1.withdrawDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "withdraw", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map