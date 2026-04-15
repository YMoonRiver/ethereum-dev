pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TokenA.sol";
import "../src/TokenB.sol";
import "../src/SimpleSwap.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        TokenA a = new TokenA();
        TokenB b = new TokenB();

        SimpleSwap swap = new SimpleSwap(address(a), address(b));

        // 初始流动性
        a.approve(address(swap), type(uint).max);
        b.approve(address(swap), type(uint).max);

        swap.addLiquidity(100_000 ether, 100_000 ether);

        vm.stopBroadcast();

        console.log("TokenA:", address(a));
        console.log("TokenB:", address(b));
        console.log("Swap:", address(swap));
    }
}