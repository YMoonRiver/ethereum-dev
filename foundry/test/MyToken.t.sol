// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken token;

    address owner = address(this);
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        token = new MyToken(1000 ether);
    }

    /*
        FUZZ 1:
        测试 mint 后余额增加正确
    */
    function testFuzz_MintBalance(
        address to,
        uint256 amount
    ) public {
        vm.assume(to != address(0));

        amount = bound(amount, 1, 1e30);

        token.mint(to, amount);

        assertEq(token.balanceOf(to), amount);
    }

    /*
        FUZZ 2:
        测试 totalSupply 正确增加
    */
    function testFuzz_TotalSupplyIncrease(
        address to,
        uint256 amount
    ) public {
        vm.assume(to != address(0));

        amount = bound(amount, 1, 1e30);

        uint256 beforeSupply = token.totalSupply();

        token.mint(to, amount);

        assertEq(
            token.totalSupply(),
            beforeSupply + amount
        );
    }

    /*
        FUZZ 3:
        测试非 owner 无法 mint
    */
    function testFuzz_NonOwnerCannotMint(
        address attacker,
        address to,
        uint256 amount
    ) public {
        vm.assume(attacker != owner);
        vm.assume(to != address(0));

        vm.prank(attacker);

        vm.expectRevert();

        token.mint(to, amount);
    }
}