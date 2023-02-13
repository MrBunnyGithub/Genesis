import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import MultiSig from './MultiSig';

const provider = new ethers.providers.Web3Provider(window.ethereum);

  async function connectWallet() {
      document.getElementById("wallet").innerHTML = "Connect Wallet";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const account = await(provider.send("eth_requestAccounts",[]));
      //return account;
    }

export async function submitTransaction(MultiSigContract, signer) {

  const _destination = document.getElementById('_destination').value;
  const _value =  ethers.BigNumber.from(document.getElementById('_value').value);

  if (_destination == "" && ethers.utils.isAddress(_destination) == false) { 
    document.getElementById("error2").innerHTML = "Invalid Address entered" ;
    throw new Error("error"); 
  } else { document.getElementById("error2").innerHTML = ""; }

  if (_value == 0) { 
    document.getElementById("error2").innerHTML = "Value has to be greater than 0" ;
    throw new Error("error"); 
  } else { document.getElementById("error2").innerHTML = ""; }

  const approveTxn = await MultiSigContract.connect(signer).
  submitTransaction(_destination, _value);

  await approveTxn.wait();

   document.getElementById("approveTxn").innerHTML = approveTxn;
}

export async function executeTransaction(MultiSigContract, signer) {

  const approveTxn = await MultiSigContract.connect(signer).
  executeTransaction(1);

  await approveTxn.wait();
}

export async function confirmTransaction(MultiSigContract, signer) {

  const approveTxn = await MultiSigContract.connect(signer).
  confirmTransaction(1);

  await approveTxn.wait();
}

function App() {

  const [multiSigs, setMultisig] = useState([]);
  const [account, setAccount] = useState();
  const [shortAccount, setShortAccount] = useState();
  const [signer, setSigner] = useState();
  

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
      setShortAccount(".." + accounts[0].slice(-4) + "".toUpperCase());
    }

    getAccounts();
  }, [account]);



  async function newContract() {

    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;
    const address3 = document.getElementById('address3').value;
    const address4 = document.getElementById('address4').value;
    const address5 = document.getElementById('address5').value;

    const addressList = [];

    if (address1 != "" && ethers.utils.isAddress(address1)) { addressList.push(address1); }
    if (address2 != "" && ethers.utils.isAddress(address2)) { addressList.push(address2); }
    if (address3 != "" && ethers.utils.isAddress(address3)) { addressList.push(address3); }
    if (address4 != "" && ethers.utils.isAddress(address4)) { addressList.push(address4); }
    if (address5 != "" && ethers.utils.isAddress(address5)) { addressList.push(address5); }

    const required = document.getElementById('required').value;


    if (addressList.length < 2) { 

      document.getElementById("error1").innerHTML = "Invalid Address(s) entered or <br> Make Sure you enter more than 2 Address's";
      throw new Error("error"); 

    } else { document.getElementById("error1").innerHTML = ""; }

    if (required > addressList.length || required == "") {

      document.getElementById("error1").innerHTML = "Required Signers needs to be more <br> than 1 and less than " + addressList.length ;
      throw new Error("error"); 


    } else { document.getElementById("error1").innerHTML = ""; }
    
      const MultiSigContract = await deploy(signer, addressList , required);


    const multiSig = {
       address: MultiSigContract.address,
       address1,
       address2,
       address3,
       address4,
       address5,
       required,
      
      handleAddTransaction: async () => {
         await submitTransaction(MultiSigContract, signer);
      },

      handleExecuteTransaction: async () => {
         await executeTransaction(MultiSigContract, signer);
      },

      handleConfirmTransaction: async () => {
         await confirmTransaction(MultiSigContract, signer);
      }

      

    };

    setMultisig([...multiSigs, multiSig]);
  }

  return (
    <>
      
<div class="float-container">
      <div className="contract">


        <h1> Create Multisig Contract </h1>


         <h4> Connected Wallet:  {shortAccount} </h4>
   

        <label>
          Address 1 *
          <input type="text" id="address1" />
        </label>

          <label>
          Address 2 *
          <input type="text" id="address2" />
        </label>

           <label>
          Address 3
          <input type="text" id="address3" />
        </label>

          <label>
          Address 4
          <input type="text" id="address4" />
        </label>

          <label>
         Address 5
          <input type="text" id="address5" />
        </label>


        <label>
         Required Signers *
          <input type="text" id="required"  placeholder=""/>
        </label>

          <label id ="error1">
          </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Launched Contracts </h1>

        <div id="container">
          {multiSigs.map((multiSig) => {
            return <MultiSig key={multiSig.address} {...multiSig} />;
          })}
        </div>
      </div>

      </div>
    </>
  );
}

export default App;
