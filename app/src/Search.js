export default function Search({
  searchCA,
  searchTXID,
  proposalConfirmed,
  buttonConfirm,
  confirmedCount,
  required,
  signers,
  destination,
  value,
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
          <div> Signers: </div>
          <div id={signers}> </div>
        </li>
        <li>
          <div> To Send: </div>
          <div id ={destination}></div>
        </li>
          <li>
          <div> Amount: </div>
          <div id={value}></div>
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
          <div> Transaction Id: </div>
          <div> {searchTXID} </div>
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
