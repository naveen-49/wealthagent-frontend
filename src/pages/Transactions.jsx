
import { useEffect, useState } from "react";
import api from "../api/axios";

function Transactions() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [holdings, setHoldings] = useState([]);

  const [transactionType, setTransactionType] = useState("DEPOSIT");
  const [amount, setAmount] = useState("");
  const [symbol, setSymbol] = useState("");
  const [holdingId, setHoldingId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const accountResponse = await api.get(
        "/transactions/account/"
      );

      const transactionsResponse = await api.get(
        "/transactions/"
      );

      const holdingsResponse = await api.get(
        "/holdings/client"
      );

      setAccount(accountResponse.data);
      setTransactions(transactionsResponse.data);
      setHoldings(holdingsResponse.data);
    } catch (error) {
      console.error("FETCH DATA ERROR:", error);

      setError(
        error.response?.data?.error ||
          "Unable to load transaction data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!account?.id) {
      setError("Account not found.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    if (transactionType === "BUY") {
      if (!symbol.trim()) {
        setError("Enter a stock symbol.");
        return;
      }

      if (
        !quantity ||
        Number(quantity) <= 0 ||
        !price ||
        Number(price) <= 0
      ) {
        setError("Enter a valid quantity and price.");
        return;
      }
    }

    if (transactionType === "SELL") {
      if (!holdingId) {
        setError("Select a holding for SELL.");
        return;
      }

      if (
        !quantity ||
        Number(quantity) <= 0 ||
        !price ||
        Number(price) <= 0
      ) {
        setError("Enter a valid quantity and price.");
        return;
      }
    }

    setTransactionLoading(true);

    try {
      const transactionData = {
        account_id: account.id,
        transaction_type: transactionType,
        amount: Number(amount),
      };

      if (transactionType === "BUY") {
        transactionData.symbol = symbol.trim().toUpperCase();
        transactionData.quantity = Number(quantity);
        transactionData.price = Number(price);
      }

      if (transactionType === "SELL") {
        transactionData.holding_id = Number(holdingId);
        transactionData.quantity = Number(quantity);
        transactionData.price = Number(price);
      }

      const response = await api.post(
        "/transactions/",
        transactionData
      );

      console.log(
        "TRANSACTION RESPONSE:",
        response.data
      );

      setMessage("Transaction created successfully!");

      setAmount("");
      setSymbol("");
      setHoldingId("");
      setQuantity("");
      setPrice("");

      await fetchData();
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Transaction failed."
      );
    } finally {
      setTransactionLoading(false);
    }
  };

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className="transactions-page">
      <h1>Manage Transactions</h1>

      {account && (
        <p>
          Account: {account.account_number} | Balance: ₹
          {account.balance}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="transaction-form"
      >
        <label>Transaction Type</label>

        <select
          value={transactionType}
          onChange={(event) => {
            setTransactionType(event.target.value);
            setError("");
            setMessage("");
            setSymbol("");
            setHoldingId("");
            setQuantity("");
            setPrice("");
          }}
        >
          <option value="DEPOSIT">Deposit</option>
          <option value="WITHDRAWAL">Withdrawal</option>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
          <option value="DIVIDEND">Dividend</option>
        </select>

        <label>Amount (₹)</label>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
          min="0"
          step="0.01"
          required
        />

        {transactionType === "BUY" && (
          <>
            <label>Stock Symbol</label>

            <input
              type="text"
              placeholder="Enter symbol (e.g. TCS)"
              value={symbol}
              onChange={(event) =>
                setSymbol(event.target.value.toUpperCase())
              }
              required
            />

            <p>
              Enter a symbol to create a new holding if
              you do not own this stock yet.
            </p>

            <label>Quantity</label>

            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(event) =>
                setQuantity(event.target.value)
              }
              min="0"
              step="0.000001"
              required
            />

            <label>Price (₹)</label>

            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              min="0"
              step="0.01"
              required
            />
          </>
        )}

        {transactionType === "SELL" && (
          <>
            <label>Holding</label>

            <select
              value={holdingId}
              onChange={(event) =>
                setHoldingId(event.target.value)
              }
              required
            >
              <option value="">
                Select a holding
              </option>

              {holdings.map((holding) => (
                <option
                  key={holding.id}
                  value={holding.id}
                >
                  {holding.symbol ||
                    `Holding ${holding.id}`}
                </option>
              ))}
            </select>

            {holdings.length === 0 && (
              <p>No holdings available for selling.</p>
            )}

            <label>Quantity</label>

            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(event) =>
                setQuantity(event.target.value)
              }
              min="0"
              step="0.000001"
              required
            />

            <label>Price (₹)</label>

            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              min="0"
              step="0.01"
              required
            />
          </>
        )}

        <button
          type="submit"
          disabled={transactionLoading}
        >
          {transactionLoading
            ? "Processing..."
            : "Submit Transaction"}
        </button>
      </form>

      {message && <p>{message}</p>}

      {error && (
        <p className="error-message">{error}</p>
      )}

      <h2>Transaction History</h2>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>

                  <td>
                    {transaction.transaction_type}
                  </td>

                  <td>
                    ₹{transaction.amount ?? "0"}
                  </td>

                  <td>
                    {transaction.quantity ?? "-"}
                  </td>

                  <td>
                    {transaction.price
                      ? `₹${transaction.price}`
                      : "-"}
                  </td>

                  <td>
                    {transaction.transaction_date
                      ? new Date(
                          transaction.transaction_date
                        ).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Transactions;