export default function MultiSig({
  address, // contract adddress
  address1,
  address2,
  address3,
  address4,
  address5,
  required
  
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Contract Address </div>
          <div> {address} </div>
        </li>
        <li>
          <div> Address 1: </div>
          <div> {address1} </div>
        </li>
        <li>
          <div> Address 2: </div>
          <div> {address2} </div>
        </li>
        <li>
          <div> Address 3: </div>
          <div> {address3} </div>
        </li>
          <li>
          <div> Address 4: </div>
          <div> {address4} </div>
        </li>
          <li>
          <div> Address 5: </div>
          <div> {address5} </div>
        </li>
         <li>
          <div> Required Signers </div>
          <div> {required} </div>
        </li>

  

      </ul>
    </div>
  );
}

/*

<div

      <label>
          Send to Address:
          <input type="text" id="_destination" />
        </label>

        <label>
          Amount to Send (GWEI):
          <input type="text" id="_value" />
        </label>

           <div
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleAddTransaction();
          }}
        >
          Propose Transaction
        </div>

          <label id ="error2">
          </label>


        <li>
          <div> Transaction Id: </div>
          <div id="approveTxn"> </div>
        </li>

          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleConfirmTransaction();
          }}
        >
          Confirm Transaction
        </div>

        <div
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleExecuteTransaction();
          }}
        >
          Execute Transaction
        </div>

*/
