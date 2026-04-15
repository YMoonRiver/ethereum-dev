pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract SimpleSwap {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint public reserveA;
    uint public reserveB;

    event AddLiquidity(address indexed user, uint amountA, uint amountB);
    event Swap(address indexed user, address tokenIn, uint amountIn, uint amountOut);

    constructor(address _a, address _b) {
        tokenA = IERC20(_a);
        tokenB = IERC20(_b);
    }

    // =========================
    // 添加流动性（决定初始价格）
    // =========================
    function addLiquidity(uint amountA, uint amountB) external {
        require(amountA > 0 && amountB > 0, "invalid amount");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        reserveA += amountA;
        reserveB += amountB;

        emit AddLiquidity(msg.sender, amountA, amountB);
    }

    // =========================
    // A -> B
    // =========================
    function swapAforB(uint amountAIn) external returns (uint amountBOut) {
        require(amountAIn > 0, "invalid input");
        require(reserveA > 0 && reserveB > 0, "no liquidity");

        tokenA.transferFrom(msg.sender, address(this), amountAIn);

        // ✅ 手续费 0.3%
        uint amountInWithFee = amountAIn * 997 / 1000;

        // ✅ 正确公式
        amountBOut = (reserveB * amountInWithFee) / (reserveA + amountInWithFee);

        require(amountBOut > 0, "insufficient output");

        reserveA += amountAIn;
        reserveB -= amountBOut;

        tokenB.transfer(msg.sender, amountBOut);

        emit Swap(msg.sender, address(tokenA), amountAIn, amountBOut);
    }

    // =========================
    // B -> A
    // =========================
    function swapBforA(uint amountBIn) external returns (uint amountAOut) {
        require(amountBIn > 0, "invalid input");
        require(reserveA > 0 && reserveB > 0, "no liquidity");

        tokenB.transferFrom(msg.sender, address(this), amountBIn);

        uint amountInWithFee = amountBIn * 997 / 1000;

        amountAOut = (reserveA * amountInWithFee) / (reserveB + amountInWithFee);

        require(amountAOut > 0, "insufficient output");

        reserveB += amountBIn;
        reserveA -= amountAOut;

        tokenA.transfer(msg.sender, amountAOut);

        emit Swap(msg.sender, address(tokenB), amountBIn, amountAOut);
    }

    // =========================
    // 查看价格（给前端用）
    // =========================
    function getPriceAtoB(uint amountAIn) external view returns (uint) {
        if (reserveA == 0 || reserveB == 0) return 0;

        uint amountInWithFee = amountAIn * 997 / 1000;
        return (reserveB * amountInWithFee) / (reserveA + amountInWithFee);
    }

    function getPriceBtoA(uint amountBIn) external view returns (uint) {
        if (reserveA == 0 || reserveB == 0) return 0;

        uint amountInWithFee = amountBIn * 997 / 1000;
        return (reserveA * amountInWithFee) / (reserveB + amountInWithFee);
    }
}