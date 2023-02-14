import { ethers } from 'ethers';
import Genesis from './artifacts/contracts/Genesis.sol/Genesis';

// signer, address , required,  value

export default async function deploy(signer, address , required) {
  const factory = new ethers.ContractFactory(
    Genesis.abi,
    Genesis.bytecode,
    signer
  );
  return factory.deploy(address, required);
}
