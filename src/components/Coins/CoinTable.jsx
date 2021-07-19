import CoinGecko from "coingecko-api";
import { useEffect, useState } from "react";
import "./CoinTable.scss";
import { FaStar, FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { TiArrowUnsorted } from "react-icons/ti";
import { useHistory } from "react-router-dom";
import DenomSelector from "../DenomSelector";

import supportedCurrencies from "../../supportedCurrencies";

export default function CoinTable({varBalance, setVarBalance}) {
  const CoinGeckoClient = new CoinGecko();
  const [coins, setCoins] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchId, setSearchId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [allCoins, setAllCoins] = useState([]);
  const [orderBy, setOrderBy] = useState("market_cap_desc");

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: varBalance,
  });

  const history = useHistory();
  const handleRowClick = (coin) => {
    history.push(`/coins/${coin.id}`);
  };

  const numColor = (num) => {
    if (num[0] === "-") {
      return <div style={{ color: "red" }}>{num}</div>;
    }
    return <div style={{ color: "green" }}>{num}</div>;
  };
  useEffect(() => {
    const getCoinData = async () =>
      await CoinGeckoClient.coins.markets({
        order: orderBy,
        per_page: 50,
        vs_currency: varBalance,
        page: pageNumber,
        ids: searchId,
      });
    getCoinData().then((res) => setCoins(res.data));
  }, [pageNumber, searchId, searchValue, orderBy, varBalance]);

  useEffect(() => {
    const coinData = async () =>
      await CoinGeckoClient.coins.markets({
        order: "market_cap_desc",
        vs_currency: varBalance,
        per_page: 250,
      });
    coinData().then((res) => setAllCoins(res.data));
  }, []);

  useEffect(() => {
    if (watchlist) {
      const myList = localStorage.getItem("Watchlist");
      myList && setWatchlist(myList.split(","));
    }
  }, []);

  const getCoinId = (search) => {
    const shortSearch = search
      .replaceAll(" ", "")
      .replaceAll("-", "")
      .toLowerCase();

    allCoins.forEach((coin) => {
      if (
        shortSearch ===
        coin.name.replaceAll(" ", "").replaceAll("-", "").toLowerCase()
      ) {
        setSearchId(coin.id);
        setPageNumber(1);
      } else if (shortSearch === "") {
        setSearchId("");
      }
    });
  };

  const addToWatchlist = (coin) => {
    if (!watchlist.includes(coin.id)) {
      let newWatchList = [...watchlist, coin.id];
      setWatchlist([...watchlist, coin.id]);
      localStorage.setItem("Watchlist", newWatchList);
    } else {
      const newWatchList = watchlist.filter((item) => item !== coin.id);
      setWatchlist(newWatchList);
      localStorage.setItem("Watchlist", newWatchList);
    }
  };

  return (
    <>
      <div className="top-section">
        <div className="search-section">
          <DenomSelector varBalance={varBalance} setVarBalance={setVarBalance} currencies={supportedCurrencies}/>
          <form>
            <input
              value={searchValue}
              placeholder="🔍 Search Coin"
              onChange={(event) => {
                setSearchValue(event.target.value);
                getCoinId(event.target.value);
              }}
              className="coin-search"
            />
          </form>
        </div>

        <div className="arrow-buttons">
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className="page-arrow"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={() => setPageNumber(pageNumber + 1)}
            className="page-arrow"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>

      <table className="coins-table">
        <thead>
          <tr className="coins-header">
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
            <th />
            <th id="coin-name">Name</th>
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
        {coins.map((coin) => (
          <tbody>
            <tr>
              <td onClick={() => handleRowClick(coin)}>
                {coin.market_cap_rank}
              </td>
              <td id="logo-name" onClick={() => handleRowClick(coin)}>
                <img className="coin-logo" src={coin.image} alt={coin.name} />{" "}
              </td>
              <td onClick={() => handleRowClick(coin)}>
                <p className="name">
                  <strong>{coin.name}</strong>
                </p>
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
              <td onClick={() => addToWatchlist(coin)}>
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
      <div className="bottom-section">
        <div className="search-section">
          <DenomSelector varBalance={varBalance} setVarBalance={setVarBalance} currencies={supportedCurrencies}/>
        </div>

        <div className="arrow-buttons">
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className="page-arrow"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={() => setPageNumber(pageNumber + 1)}
            className="page-arrow"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </>
  );
}
