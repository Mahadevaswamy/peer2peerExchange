// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MSUSDCToken is ERC20, AccessControl {
    // constructor() ERC20("WUSDCTOken", "MUSDC") {
    //     _mint(msg.sender, 50000000000000000000);
    // }

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("MUSDC", "MUSDC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
    function decimals() override public view virtual returns (uint8) {
        return 0;
    }

}
