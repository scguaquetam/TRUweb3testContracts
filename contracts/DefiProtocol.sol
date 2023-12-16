// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LoanContract is ReentrancyGuard {
    IERC20 public loanToken;
    IERC20 public collateralToken;

    struct Loan {
        uint256 amount;
        uint256 collateral;
        bool isRepaid;
    }

    mapping(address => Loan) public loans;

    event LoanTaken(address borrower, uint256 loanAmount, uint256 collateralAmount);
    event LoanRepaid(address borrower, uint256 loanAmount);

    constructor(address _loanToken, address _collateralToken) {
        loanToken = IERC20(_loanToken);
        collateralToken = IERC20(_collateralToken);
    }

    function takeLoan(uint256 loanAmount, uint256 collateralAmount) external nonReentrant {
        require(loans[msg.sender].amount == 0, "Existing loan must be repaid first");
        require(collateralAmount >= loanAmount, "Insufficient collateral");

        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);
        loanToken.transfer(msg.sender, loanAmount);

        loans[msg.sender] = Loan(loanAmount, collateralAmount, false);
        emit LoanTaken(msg.sender, loanAmount, collateralAmount);
    }

    function repayLoan() external nonReentrant {
        Loan storage loan = loans[msg.sender];
        require(loan.amount > 0, "No active loan");
        require(!loan.isRepaid, "Loan already repaid");

        loanToken.transferFrom(msg.sender, address(this), loan.amount);
        collateralToken.transfer(msg.sender, loan.collateral);

        loan.isRepaid = true;
        emit LoanRepaid(msg.sender, loan.amount);
    }

}
