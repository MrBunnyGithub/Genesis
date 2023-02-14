import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import MultiSig from './MultiSig';
import Search from './Search';
import Proposal from './Proposal';


const abi = [{"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_confirmations","type":"uint256"}],"stateMutability":"payable","type":"constructor"},{"inputs":[{"internalType":"address payable","name":"destination","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"addTransaction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"confirmations","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"transactionId","type":"uint256"}],"name":"getConfirmationsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"transactionId","type":"uint256"}],"name":"isConfirmed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"owners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"required","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"dest","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"submitTransaction","outputs":[{"internalType":"uint256","name":"_transactionId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"transactionCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"transactions","outputs":[{"internalType":"address payable","name":"destination","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bool","name":"executed","type":"bool"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}];

const provider = new ethers.providers.Web3Provider(window.ethereum);

  async function connectWallet() {
      document.getElementById("wallet").innerHTML = "Connect Wallet";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const account = await(provider.send("eth_requestAccounts",[]));
      //return account;
    }

export async function submitTransaction(MultiSig_CA,_destination,_value, setTXID, abi, signer) {

  const MultiSigContract = new ethers.Contract(MultiSig_CA, abi, signer);

  const approveTxn  = await MultiSigContract.submitTransaction(_destination,_value);

  await approveTxn.wait();
  
  const transactionId = await MultiSigContract.transactionCount();

  document.getElementById(setTXID).innerHTML = transactionId;
}


export async function isConfirmed(MultiSig_CA, TXID, abi, signer) {

  const MultiSigContract = new ethers.Contract(MultiSig_CA, abi, signer);

  const confirmed  = await MultiSigContract.isConfirmed(TXID);
   document.getElementById("confirmed" + MultiSig_CA + TXID).innerHTML = confirmed;

  if (confirmed) {
    let element = document.getElementById("buttonconfirmed" + MultiSig_CA + TXID);
     element.setAttribute("hidden", "hidden");
  }

  const confirmationCount  = await MultiSigContract.getConfirmationsCount(TXID);
  document.getElementById("confirmedCount" + MultiSig_CA + TXID).innerHTML = confirmationCount;

  const required  = await MultiSigContract.required();
  document.getElementById("required" + MultiSig_CA + TXID).innerHTML = required;

}

export async function confirmTransaction(MultiSig_CA, TXID, abi, signer) {


  const MultiSigContract = new ethers.Contract(MultiSig_CA, abi, signer);

  const tx  = await MultiSigContract.confirmTransaction(TXID);
  await tx.wait();

  // if sucessfull update

  if (tx) {

      const confirmed  = await MultiSigContract.isConfirmed(TXID);
      document.getElementById("confirmed" + MultiSig_CA + TXID).innerHTML = confirmed;

      if (confirmed) {
        let element = document.getElementById("buttonconfirmed" + MultiSig_CA + TXID);
        element.setAttribute("hidden", "hidden");
      }

      const confirmationCount  = await MultiSigContract.getConfirmationsCount(TXID);
      document.getElementById("confirmedCount" + MultiSig_CA + TXID).innerHTML = confirmationCount;

  }

}


export function handleError(inputBox,error) {
  document.getElementById(inputBox).innerHTML = "Fill all Required Fields" ;
  return true;
}

function App() {

  const [multiSigs, setMultisig] = useState([]);
  const [searchs, setSearch] = useState([]);
  const [proposals, setProposal] = useState([]);
  const [account, setAccount] = useState();
  const [shortAccount, setShortAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
      setShortAccount(".." + accounts[0].slice(-4).toUpperCase());
    }

    getAccounts();
  }, [account]);


    async function submitProposal() {

      const MultiSig_CA = document.getElementById('contractAddressProposal').value;
      const destination = document.getElementById('_destination').value;
      let value = document.getElementById('_value').value;

      let error = false;
      document.getElementById("error2").innerHTML = "";


      if (MultiSig_CA == "" || destination == "" || value == "" ) {
        error = handleError("error2","Fill all Fields");
      }

      
      if (ethers.utils.isAddress(destination) == false) { 
        error = handleError("error2","Invalid Address entered");
      } 

      if (value <= 0) { 
          error = handleError("error2", "Value has to be greater than 0");
      } 

      
      if (error == false) { 

        let element = document.getElementById("submittedProposals");
        element.removeAttribute("hidden");

        let gweiValue = ethers.BigNumber.from(value);
        let setTXID = "approveTxn" + MultiSig_CA + destination + value;

        submitTransaction(MultiSig_CA,destination,gweiValue, setTXID, abi, signer); 
        
          const proposal = {
            MultiSig_CA,
            account,
            setTXID,
            destination,
            value
            }

        setProposal([...proposals, proposal]);

        // 0xa493a3716b68c5643ae14f18b745c96a27829bc8

      }

      
    }

    async function searchProposal() {

          let error = false;

          const searchCA = document.getElementById('contractAddress').value;
          const searchTXID = document.getElementById('searchTX').value;

          if (searchCA == "" || ethers.utils.isAddress(searchCA) == false) { error = true; }
          if (searchTXID == "" || searchTXID < 1) { error = true; }

          if (error == true) { 
            throw new Error("error"); 
            document.getElementById("error3").innerHTML = "Check Address and Transaction Id";
 
          } else {
            document.getElementById("error1").innerHTML = ""; 
            let element = document.getElementById("proposals");
            element.removeAttribute("hidden");
          }

           isConfirmed(searchCA,searchTXID,abi,signer);

           let proposalConfirmed = "confirmed" + searchCA + searchTXID;
           let buttonConfirm = "buttonconfirmed" + searchCA + searchTXID;
           let confirmedCount = "confirmedCount" + searchCA + searchTXID;
           let required = "required" + searchCA + searchTXID;

          const search = {
            searchCA,
            searchTXID,
            proposalConfirmed,
            buttonConfirm,
            confirmedCount,
            required,
            handleConfirmTransaction: async () => {
              await confirmTransaction(searchCA, searchTXID, abi, signer);
            }
          };

    setSearch([...searchs, search]);

    }

  async function newGenesis() {

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


    // debug

    let error = false;

    if (addressList.length < 2) { 

      document.getElementById("error1").innerHTML = "Invalid Address(s) entered or <br> Make Sure you enter more than 2 Address's";
      throw new Error("error"); 
      error = true;

    } 

    if (required > addressList.length || required == "") {

      document.getElementById("error1").innerHTML = "Required Signers needs to be more <br> than 1 and less than " + addressList.length ;
      throw new Error("error"); 
      error = true;
      
    } 

    // debug
    
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


    };    

    if (error == false) {
      document.getElementById("error1").innerHTML = ""; 
      let element = document.getElementById("launched");
      element.removeAttribute("hidden");
      element = document.getElementById("createContract");
      element.setAttribute("hidden", "hidden");
    }

    setMultisig([...multiSigs, multiSig]);

  }

  return (
    <>
      

{/* Create Contract */}
      

      <div className="contract" id="createContract">
        <h1> Create Genesis Contract</h1>
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

            newGenesis();
          }}
        >
          Create Contract
        </div>
      </div>

      <div className="existing-contracts" hidden id="launched">
        <h1> Launched Contracts </h1>

        <div id="container">
          {multiSigs.map((multiSig) => {
            return <MultiSig key={multiSig.address} {...multiSig} />;
          })}
        </div>
      </div>


      {/* Create Contract */}



      {/* Submit Proposal */}


       <div className="existing-contracts">
        <h1> Submit Proposal </h1>

         <label>
          Contract Address 
          <input type="text" id="contractAddressProposal" />
        </label>

      <label>
          Send to Address:
          <input type="text" id="_destination" />
        </label>

        <label>
          Amount to Send (GWEI):
          <input type="text" id="_value" />
        </label>

          <label id ="error2"></label>

           <div
          className="button"
          id=""
          onClick={(e) => {
            e.preventDefault();

            submitProposal();
          }}
        >
          Propose Transaction
        </div>
        </div>
          

      <div className="existing-contracts" hidden id="submittedProposals">
        <h1> Submitted Proposals </h1>

        <div id="container">
          {proposals.map((proposal) => {
            return <Proposal key={proposal.address} {...proposal} />;
          })}
        </div>
      </div>
        


        {/* Submit Proposal */}



        {/* Search Proposal */}


      <div className="existing-contracts">
        <h1> Search Proposal </h1>
        <label>
          Contract Address:
          <input type="text" id="contractAddress" />
        </label>
          <label>
          Transaction Id:
          <input type="text" id="searchTX" />
        </label>
         <label id ="error3"></label>

        <div
          className="button"
          id="search"
          onClick={(e) => {
            e.preventDefault();

            searchProposal();
          }}
        >
          Search
        </div>
      </div>

         <div className="existing-contracts" id="proposals" hidden>
          <h1> Proposals </h1>
          <h4> Connected Wallet:  {shortAccount} </h4>
        <div id="container">
          {searchs.map((search) => {
            return <Search key={search.searchCA} {...search} />;
          })}
        </div>
        </div>

       

         <div className="existing-contracts" id="proposals" hidden>
          <h1> Proposals </h1>
          <h4> Connected Wallet:  {shortAccount} </h4>
        <div id="container">
          {searchs.map((search) => {
            return <Search key={search.searchCA} {...search} />;
          })}
        </div>
        </div>

          {/* Search Proposal */}


     
    </>
  );
}

export default App;
