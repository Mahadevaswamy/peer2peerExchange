// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract p2p_new {
    mapping(string => address) public whitelistedTokens;
    address owner;
    uint saleOrderRegistryCount;

    struct SellOrderDetails {
        uint sellOrderId;
        address sellerAddress;
        string tokenId;
        uint256 availableTokens;
        string exchangeToken;
        uint pricePerToken;
    }

    mapping(uint => SellOrderDetails) sellOrderMap;

    constructor() {
        owner = msg.sender;
    }

    function whitelistToken(
        string memory symbol,
        address tokenAddress
    ) external {
        require(
            msg.sender == owner,
            "Only Owner is allowed to execute this function"
        );
        whitelistedTokens[symbol] = tokenAddress;
    }

    function depositToken(uint256 amount, string memory symbol) external {
        ERC20(whitelistedTokens[symbol]).transferFrom(
            msg.sender,
            address(this),
            amount
        );
    }

    function withdrawTokens(uint256 amount, string memory symbol) external {
        ERC20(whitelistedTokens[symbol]).transfer(msg.sender, amount);
    }

    function postSellOrder(
        address sellerAddress,
        string memory tokenId,
        uint amount,
        string memory exchangeToken,
        uint pricePerToken
    ) public {
        // amount should be > 0

        // transfer USDC to this contract
        //
        //  USDc.transferFrom(sellerAddress, address(this), availableTokens );

        // update staking balance
        ERC20(whitelistedTokens[tokenId]).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        sellOrderMap[saleOrderRegistryCount] = SellOrderDetails(
            saleOrderRegistryCount,
            sellerAddress,
            tokenId,
            amount,
            exchangeToken,
            pricePerToken
        );
        saleOrderRegistryCount++;
    }

    function getSellOrders() public view returns (SellOrderDetails[] memory) {
        SellOrderDetails[] memory ret = new SellOrderDetails[](
            saleOrderRegistryCount
        );
        for (uint i = 0; i < saleOrderRegistryCount; i++) {
            ret[i] = sellOrderMap[i];
        }
        return ret;
    }

    function processBuyOrder(
        address buyerAddress,
        uint sellOrderID,
        string memory exchangeTokenId,
        uint amount
    ) public {
        SellOrderDetails memory sellOrder = sellOrderMap[sellOrderID];
        require(
            sellOrder.availableTokens > 0,
            "Sell order is already withdrawn"
        );
        address sellerAddress = sellOrder.sellerAddress;

        //sending incoming to Seller
        ERC20(whitelistedTokens[exchangeTokenId]).transferFrom(
            msg.sender,
            sellerAddress,
            amount
        );
        //sending token on sale to buyer
        ERC20(whitelistedTokens[sellOrder.tokenId]).transfer(
            buyerAddress,
            sellOrder.availableTokens
        );

        sellOrderMap[sellOrderID].availableTokens = 0;
        // sellOrderMap[sellOrderID].buyerAddress=buyerAddress;
    }

    function withdrawSellOrder(uint sellOrderId) public {
        SellOrderDetails memory sellOrder = sellOrderMap[sellOrderId];
ERC20(whitelistedTokens[sellOrder.tokenId]).transfer(
            msg.sender,
            sellOrder.availableTokens
        );
        sellOrderMap[sellOrderId].availableTokens = 0;
    }
}
