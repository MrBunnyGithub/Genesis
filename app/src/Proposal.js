export default function Proposal({
	MultiSig_CA,
	account,
	setTXID,
	destination,
	value
}) {
  return (

  	    <div className="existing-contract">

		<ul className="fields">
  	      <li>
          <div> Contract Address: </div>
          <div> {MultiSig_CA} </div>
        </li>
          <li>
          <div> Address Proposes: </div>
          <div>{account} </div>
        </li>
          <li>
          <div> To Send: </div>
          <div>{destination}</div>
        </li>
          <li>
          <div> Amount: </div>
          <div>{value} GWEI </div>
        </li>

         <li>
           <div>  Transaction Id: </div>
          <div id={setTXID}> Pending... </div>
         </li>
         </ul>
        </div>

  );
}