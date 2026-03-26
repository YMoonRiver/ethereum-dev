// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyToken.sol";

contract Deploy is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(privateKey);

        // 初始发行 100 万（18位精度）
        MyToken token = new MyToken(1_000_000 ether);

        vm.stopBroadcast();
    }
}