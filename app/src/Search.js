export default function MultiSig({
  searchCA,
  searchTXID,
  proposalConfirmed,
  buttonConfirm,
  confirmedCount,
  required,
  handleConfirmTransaction
  
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Contract Address: </div>
          <div> {searchCA} </div>
        </li>
        <li>
          <div> Transaction Id: </div>
          <div> {searchTXID} </div>
        </li>
          <li>
          <div> Confirmed: </div>
          <div id ={confirmedCount}> </div>
        </li>
          <li>
          <div> Required: </div>
          <div id ={required}> </div>
        </li>
          <li>
          <div> Transaction Executed: </div>
          <div id ={proposalConfirmed}> </div>
        </li>

           <div
          className="button"
          id={buttonConfirm}
          onClick={(e) => {
            e.preventDefault();

            handleConfirmTransaction();
          }}
        >
          Accept Proposal
        </div>

      </ul>
    </div>
  );
}

/*

<div
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
