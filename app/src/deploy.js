import { ethers } from 'ethers';
import MultiSig from './artifacts/contracts/MultiSig.sol/MultiSig';

// signer, address , required,  value

export default async function deploy(signer, address , required) {
  const factory = new ethers.ContractFactory(
    MultiSig.abi,
    MultiSig.bytecode,
    signer
  );
  return factory.deploy(address, required);
}
