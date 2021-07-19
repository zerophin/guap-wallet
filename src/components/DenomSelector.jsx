const DenomSelector = ({varBalance, setVarBalance, currencies}) => {
  return (
    <select
      value={varBalance}
      onChange={(event) => {
        setVarBalance(event.target.value);
      }}
      className="denom"
    >
      {currencies && currencies.map(currency => <option key={currency}>{currency}</option>)}
      {/*<option>cad</option>*/}
      {/*<option>usd</option>*/}
      {/*<option>eur</option>*/}
      {/*<option>gbp</option>*/}
      {/*<option>aud</option>*/}
      {/*<option>chf</option>*/}
    </select>
  );
};

export default DenomSelector;
