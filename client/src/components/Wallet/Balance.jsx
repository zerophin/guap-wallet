import Status from "../../images/status.png";
import Switch from "react-switch";

export default function Balance(props) {
  const dollars = props.cadBalance.toLocaleString("en-US", {
    style: "currency",
    currency: props.currency,
  });

  const TokenList = () => {
    const tokenIds = Object.keys(props.tokens);

    const list = tokenIds.map((token) => {
      return (
        <li key={token}>
          {props.tokens[token].name} :{props.tokens[token].value}
        </li>
      );
    });

    return list;
  };

  return (
    <div className="balance">
      <div className="toggle-switch">
        <p>BCH</p>
        <Switch
          checked={props.toggle}
          onChange={props.handleChange}
          onColor="#7ED957"
          offColor="#5664D2"
          onHandleColor="#5664D2"
          offHandleColor="#7ED957"
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          handleDiameter={30}
          uncheckedIcon={false}
          checkedIcon={false}
          height={20}
          width={48}
          className="react-switch"
          id="material-switch"
        />
        <p>SLP</p>
      </div>
      <h1> BALANCE </h1>
      {props.denominations}
      {props.loading ? (
        <img className="status-image" src={Status} alt="loading" />
      ) : (
        <>
          {!props.toggle ? (
            <h2>
              <div> {dollars} </div>
              BCH:
              <span> {props.bal} </span>
            </h2>
          ) : (
            <h2>
              TOKENS:
              <span> {props.token} </span>
              <ul>
                <TokenList />
              </ul>
            </h2>
          )}
        </>
      )}
      <div>
        <button onClick={props.refresh}>Check Balance</button>
      </div>
    </div>
  );
}
