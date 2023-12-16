const hre = require("hardhat");
import { ethers } from "hardhat"
import { 
  Contract, 
  ContractFactory 
} from "ethers"

const main = async(): Promise<any> => {
  const deployer = "0x28400aa592483d6DC6776B82B25dD2E517863050";

  const USDTContract: ContractFactory = await ethers.getContractFactory("USDT");
  const usdt : Contract = await USDTContract.deploy(deployer);
  await usdt.waitForDeployment();
  console.log("USDT deployed:", usdt.address);

  const CollateralContract: ContractFactory = await ethers.getContractFactory("Collateral");
  const collateral : Contract = await CollateralContract.deploy(deployer);
  await collateral.waitForDeployment();
  console.log("Collateral deployed:", collateral.address);

  const LoanContract: ContractFactory = await ethers.getContractFactory("LoanContract");
  const loanContract: Contract = await LoanContract.deploy(usdt.address, collateral.address);
  await loanContract.waitForDeployment();
  console.log("LoanContract deployed:", loanContract.address);

  await hre.run("verify:verify", {
    address: usdt.address,
    constructorArguments: [deployer],
    contract: "contracts/USDT.sol:USDT" 
  });
  
  await hre.run("verify:verify", {
    address: collateral.address,
    constructorArguments: [deployer],
    contract: "contracts/Collateral.sol:Collateral"
  });

  await hre.run("verify:verify", {
    address: loanContract.address,
    constructorArguments: [usdt.address, collateral.address],
    contract: "contracts/LoanContract.sol:LoanContract"
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
