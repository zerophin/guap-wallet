import "./Watchlist.scss";
import { useEffect, useState } from "react";
import { FaStar, FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { TiArrowUnsorted } from "react-icons/ti";
import CoinGecko from "coingecko-api";
import { useHistory } from "react-router-dom";
import "./Coins/CoinTable.scss";
import DenomSelector from "./DenomSelector";

import supportedCurrencies from "../supportedCurrencies";

export default function Watchlist({varBalance, setVarBalance}) {
  const CoinGeckoClient = new CoinGecko();
  const [watchlist, setWatchlist] = useState(
    localStorage.getItem("Watchlist")
      ? localStorage.getItem("Watchlist").split(",")
      : []
  );
  const [watchData, setWatchData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const [orderBy, setOrderBy] = useState("market_cap_desc");

  const numColor = (num) => {
    if (num[0] === "-") {
      return <div style={{ color: "red" }}>{num}</div>;
    }
    return <div style={{ color: "green" }}>{num}</div>;
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: varBalance,
  });

  const isWatchlist = () => {
    if (watchlist.length === 0 || watchlist[0] === "") {
      return false;
    }
    return watchlist;
  };

  useEffect(() => {
    const getCoinData = async () => {
      await CoinGeckoClient.coins
        .markets({
          order: orderBy,
          per_page: 50,
          vs_currency: varBalance,
          page: pageNumber,
          ids: isWatchlist(),
        })
        .then((res) => setWatchData(res.data));
    };

    getCoinData();
  }, [watchlist, pageNumber, orderBy, varBalance]);

  const removeFromWatchlist = (coin) => {
    const newWatchList = watchlist.filter((item) => item !== coin.id);
    setWatchlist(newWatchList);
    localStorage.setItem("Watchlist", newWatchList);
  };

  const history = useHistory();
  const handleRowClick = (coin) => {
    history.push(`/coins/${coin.id}`);
  };

  return (
    <>
      <div className="top-section">
        <div>
          <DenomSelector varBalance={varBalance} setVarBalance={setVarBalance} currencies={supportedCurrencies}/>
        </div>
        <div className="arrow-buttons">
          <button
            disabled={pageNumber === 1 ? true : false}
            onClick={() => setPageNumber(pageNumber - 1)}
            className="page-arrow"
          >
            <FaAngleLeft />
          </button>
          <button
            disabled={watchlist.length <= 50 * pageNumber ? true : false}
            onClick={() => setPageNumber(pageNumber + 1)}
            className="page-arrow"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
      <table className="coins-table">
        <thead>
          <tr>
            <th>
              Rank
              <TiArrowUnsorted
                className="arrow"
                onClick={() => {
                  orderBy === "market_cap_desc"
                    ? setOrderBy("market_cap_asc")
                    : setOrderBy("market_cap_desc");
                }}
              />
            </th>
            <th></th>
            <th id="coin-name">Name </th>
            <th>
              Price
              <TiArrowUnsorted
                className="arrow"
                onClick={() => {
                  orderBy === "price_asc"
                    ? setOrderBy("price_desc")
                    : setOrderBy("price_asc");
                }}
              />
            </th>
            <th>
              Market Cap
              <TiArrowUnsorted
                className="arrow"
                onClick={() => {
                  orderBy === "market_cap_desc"
                    ? setOrderBy("market_cap_asc")
                    : setOrderBy("market_cap_desc");
                }}
              />
            </th>
            <th>24hr change</th>
            <th>Watchlist</th>
          </tr>
        </thead>
        {watchData.map((coin) => (
          <tbody>
            <tr>
              <td onClick={() => handleRowClick(coin)}>
                {coin.market_cap_rank}
              </td>
              <td id="logo-name" onClick={() => handleRowClick(coin)}>
                <img className="coin-logo" src={coin.image} alt={coin.name} />{" "}
              </td>
              <td onClick={() => handleRowClick(coin)}>
                <strong>
                  <p className="name">{coin.name}</p>
                </strong>
              </td>
              <td onClick={() => handleRowClick(coin)}>
                {formatter.format(coin.current_price)}
              </td>
              <td onClick={() => handleRowClick(coin)}>
                {formatter.format(coin.market_cap)}
              </td>
              <td onClick={() => handleRowClick(coin)}>
                {numColor(
                  Number(coin.price_change_percentage_24h / 100).toLocaleString(
                    undefined,
                    {
                      style: "percent",
                      minimumFractionDigits: 2,
                    }
                  )
                )}
              </td>
              <td onClick={() => removeFromWatchlist(coin)}>
                <FaStar
                  className="star"
                  style={
                    watchlist.includes(coin.id)
                      ? { color: "orange" }
                      : { color: "rgb(202, 202, 202)" }
                  }
                />
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </>
  );
}
