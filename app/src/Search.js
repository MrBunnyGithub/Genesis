export default function MultiSig({
  searchCA,
  searchTXID,
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

           <div
          className="button"
          id={searchCA}
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
