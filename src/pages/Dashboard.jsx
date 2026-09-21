
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";


function Dashboard() {
    const [data, setData] = useState(null);
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [holdings, setHoldings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [transactionType, setTransactionType] = useState("DEPOSIT");
    const [amount, setAmount] = useState("");
    const [transactionMessage, setTransactionMessage] = useState("");
    const [transactionLoading, setTransactionLoading] = useState(false);
    // Financial Goal States
const [goalName, setGoalName] = useState("");
const [goalTarget, setGoalTarget] = useState("");
const [goalCurrent, setGoalCurrent] = useState("0");
const [goalDate, setGoalDate] = useState("");
const [goalPriority, setGoalPriority] = useState("MEDIUM");
const [goalMessage, setGoalMessage] = useState("");
const [goalLoading, setGoalLoading] = useState(false);
// Wealth Recommendation States
const [recommendation, setRecommendation] = useState(null);
const [recommendationLoading, setRecommendationLoading] =
  useState(false);
const [recommendationError, setRecommendationError] =
  useState("");
  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      // 1. Get logged-in user's role
      const token = localStorage.getItem("access_token");

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      const role = payload.role;

      // 2. Select dashboard endpoint
      const endpoint =
        role === "ADMIN" || role === "ADVISOR"
          ? "/dashboard/advisor"
          : "/dashboard/client/full";

      // 3. Get dashboard data
      const response = await api.get(endpoint);

      console.log(
        "DASHBOARD DATA:",
        response.data
      );

      setData(response.data);

      // 4. Get account and transactions only for CLIENT
      if (role === "CLIENT") {
        const accountResponse = await api.get(
          "/transactions/account/"
        );

        setAccount(accountResponse.data);

        console.log(
          "ACCOUNT DATA:",
          accountResponse.data
        );

        const transactionsResponse = await api.get(
          "/transactions/"
        );

        setTransactions(
          transactionsResponse.data
        );
        const holdingsResponse = await api.get(
  "/holdings/client"
);

setHoldings(holdingsResponse.data);
        console.log(
          "TRANSACTIONS DATA:",
          transactionsResponse.data
        );
      }

    } catch (error) {
      console.error(
        "DASHBOARD ERROR:",
        error
      );

      setError(
        error.response?.data?.error ||
          "Failed to load dashboard"
      );

    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);
const handleTransaction = async (event) => {
  event.preventDefault();

  setTransactionMessage("");

  if (!account?.id) {
    setTransactionMessage("Account not found.");
    return;
  }

  if (!amount || Number(amount) <= 0) {
    setTransactionMessage("Please enter a valid amount.");
    return;
  }

  setTransactionLoading(true);

  try {
    const response = await api.post(
      "/transactions/",
      {
        account_id: account.id,
        transaction_type: transactionType,
        amount: Number(amount),
      }
    );

    console.log("TRANSACTION RESPONSE:", response.data);

    setTransactionMessage(
      "Transaction created successfully!"
    );

    setAmount("");

    // Refresh account balance
    const accountResponse = await api.get(
      "/transactions/account/"
    );

    setAccount(accountResponse.data);

    // Refresh transaction history
    const transactionsResponse = await api.get(
      "/transactions/"
    );

    setTransactions(transactionsResponse.data);

    console.log(
      "ACCOUNT DATA:",
      accountResponse.data
    );

    console.log(
      "TRANSACTIONS DATA:",
      transactionsResponse.data
    );

  } catch (error) {
    console.error("TRANSACTION ERROR:", error);

    setTransactionMessage(
      error.response?.data?.error ||
        error.response?.data?.msg ||
        "Transaction failed."
    );

  } finally {
    setTransactionLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };
 const handleCreateGoal = async (event) => {
  event.preventDefault();

  setGoalMessage("");

  if (!goalName || !goalTarget || !goalDate) {
    setGoalMessage(
      "Please fill in all required fields."
    );
    return;
  }

  if (Number(goalTarget) <= 0) {
    setGoalMessage(
      "Target amount must be greater than 0."
    );
    return;
  }

  if (Number(goalCurrent) < 0) {
    setGoalMessage(
      "Current amount cannot be negative."
    );
    return;
  }

  setGoalLoading(true);

  try {
    const response = await api.post("/goals/", {
      name: goalName,
      target_amount: Number(goalTarget),
      current_amount: Number(goalCurrent),
      target_date: goalDate,
      priority: goalPriority
    });

    console.log("GOAL RESPONSE:", response.data);

    setGoalMessage(
      "Financial goal created successfully!"
    );

    setGoalName("");
    setGoalTarget("");
    setGoalCurrent("0");
    setGoalDate("");
    setGoalPriority("MEDIUM");

    // Refresh dashboard data
    const token = localStorage.getItem("access_token");
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    const dashboardResponse = await api.get(
      payload.role === "ADMIN" ||
      payload.role === "ADVISOR"
        ? "/dashboard/advisor"
        : "/dashboard/client/full"
    );

    setData(dashboardResponse.data);

  } catch (error) {
    console.error("GOAL ERROR:", error);

    setGoalMessage(
      error.response?.data?.error ||
        "Failed to create financial goal."
    );
  } finally {
    setGoalLoading(false);
  }
};
const fetchRecommendation = async (goalId) => {
  setRecommendationLoading(true);
  setRecommendationError("");

  try {
    const response = await api.get(
      `/recommendations/${goalId}`
    );

    setRecommendation(response.data);
  } catch (error) {
    console.error(
      "RECOMMENDATION ERROR:",
      error
    );

    setRecommendationError(
      error.response?.data?.error ||
        "Failed to load recommendation."
    );
  } finally {
    setRecommendationLoading(false);
  }
};
  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const clientName = data?.client?.name || "User";

  const cash = data?.financial_summary?.cash ?? 0;

  const portfolioValue =
  data?.financial_summary?.portfolio_value ?? 0;

  const totalAssets =
  data?.financial_summary?.total_assets ??
  data?.total_assets ??
  0;
  const token = localStorage.getItem("access_token");

  const userRole = token
  ? JSON.parse(atob(token.split(".")[1])).role
  : "";
  return (
    <div id="dashboard-page">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✦</span>
          Nexgile
        </div>

        <p className="menu-title">MENU</p>

        <nav>
          <a href="#dashboard" className="active">
            <span>▣</span>
            Dashboard
          </a>

          <a href="#holdings-container">
            <span>▤</span>
            Investments
          </a>

          <a href="#recommendation-container">
            <span>▥</span>
            Reports
          </a>

          <button onClick={() => navigate("/transactions")}>
  Transactions
</button>
{userRole === "CLIENT" && (
  <a href="#risk-section">
    <span>◈</span>
    Security
  </a>
)}
        </nav>

        <div className="sidebar-bottom">
          <a href="#">
            <span>⚙</span>
            Settings
          </a>

          <a href="#">
            <span>?</span>
            Customer Support
          </a>

          <div className="user-box">
            <div className="profile-circle">
              {clientName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{clientName}</strong>
              <small>
  {userRole === "ADMIN"
    ? "Admin Account"
    : userRole === "ADVISOR"
    ? "Advisor Account"
    : "Client Account"}
</small>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">

        {/* TOPBAR */}
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>
              Welcome back to your financial overview
            </p>
          </div>

          <div className="topbar-actions">
            <button className="icon-button">◔</button>
            <button className="icon-button">♧</button>

            <div className="profile-circle">
              {clientName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main id="dashboard">

          {/* WELCOME */}
          <section className="welcome-section">
            <h2>
              Welcome, {clientName}
            </h2>

            <p>
              Here is your financial summary.
            </p>
          </section>

          {/* FINANCIAL SUMMARY */}
<section>
  <div className="section-heading">
    <h2>
      {userRole === "ADMIN" || userRole === "ADVISOR"
        ? "System Summary"
        : "Financial Summary"}
    </h2>

    <span className="period-badge">
      Overview
    </span>
  </div>

  <div className="summary-container">

    {userRole === "ADMIN" || userRole === "ADVISOR" ? (
      <>
        <div className="summary-card">
          <div className="card-top">
            <span>Total Clients</span>
            <span className="card-icon">♙</span>
          </div>

          <p>{data?.clients ?? 0}</p>
          <small>Registered clients</small>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <span>Total Accounts</span>
            <span className="card-icon">▤</span>
          </div>

          <p>{data?.accounts ?? 0}</p>
          <small>Managed accounts</small>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <span>Total Assets</span>
            <span className="card-icon">◈</span>
          </div>

          <p>
            ₹{Number(totalAssets).toLocaleString("en-IN")}
          </p>

          <small>Total managed assets</small>
        </div>
      </>
    ) : (
      <>
        <div className="summary-card">
          <div className="card-top">
            <span>Cash Balance</span>
            <span className="card-icon">₹</span>
          </div>

          <p>₹{Number(cash).toLocaleString("en-IN")}</p>
          <small>Available cash</small>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <span>Portfolio Value</span>
            <span className="card-icon">▤</span>
          </div>

          <p>
            ₹{Number(portfolioValue).toLocaleString("en-IN")}
          </p>

          <small>Total investment value</small>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <span>Total Assets</span>
            <span className="card-icon">◈</span>
          </div>

          <p>
            ₹{Number(totalAssets).toLocaleString("en-IN")}
          </p>

          <small>Your total financial assets</small>
        </div>
      </>
    )}

  </div>
</section>

          {/* FINANCIAL GOALS */}
         {/* FINANCIAL GOALS */}
{userRole === "CLIENT" && (
  <section>
            <div className="section-heading">
              <h2>Financial Goals</h2>

              <span className="period-badge">
                Your targets
              </span>
            </div>
             <div className="goal-card">
  <h3>Create Financial Goal</h3>

  <form onSubmit={handleCreateGoal}>

    <div className="form-group">
      <label>Goal Name</label>

      <input
        type="text"
        placeholder="Example: Buy a Bike"
        value={goalName}
        onChange={(event) =>
          setGoalName(event.target.value)
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Target Amount (₹)</label>

      <input
        type="number"
        placeholder="Enter target amount"
        value={goalTarget}
        onChange={(event) =>
          setGoalTarget(event.target.value)
        }
        min="1"
        step="0.01"
        required
      />
    </div>

    <div className="form-group">
      <label>Current Amount (₹)</label>

      <input
        type="number"
        placeholder="Enter current amount"
        value={goalCurrent}
        onChange={(event) =>
          setGoalCurrent(event.target.value)
        }
        min="0"
        step="0.01"
      />
    </div>

    <div className="form-group">
      <label>Target Date</label>

      <input
        type="date"
        value={goalDate}
        onChange={(event) =>
          setGoalDate(event.target.value)
        }
        required
      />
    </div>

    <div className="form-group">
      <label>Priority</label>

      <select
        value={goalPriority}
        onChange={(event) =>
          setGoalPriority(event.target.value)
        }
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
    </div>

    <button
      type="submit"
      disabled={goalLoading}
    >
      {goalLoading
        ? "Creating..."
        : "Create Goal"}
    </button>

    {goalMessage && (
      <p className="transaction-message">
        {goalMessage}
      </p>
    )}

  </form>
</div>
            <div id="goals-container">
              {data?.goals?.length > 0 ? (
                data.goals.map((goal) => (
                  <div className="goal-card" key={goal.id}>
                    <h3>{goal.name}</h3>

                    <p>
                      Target: ₹{goal.target_amount}
                    </p>

                    <p>
  Progress:{" "}
  {Number(goal.target_amount) > 0
    ? (
        (Number(goal.current_amount || 0) /
          Number(goal.target_amount)) *
        100
      ).toFixed(2)
    : "0.00"}
  %
</p>

                    <p>
                      Monthly Requirement: ₹
                      {goal.monthly_requirement}
                    </p>
                    <button
  type="button"
  onClick={() => fetchRecommendation(goal.id)}
>
  View Recommendation
</button>
                  </div>
                ))
              ) : (
                <div className="goal-card">
                  <p>No financial goals found.</p>
                </div>
              )}
              
            </div>
            </section>
)}
          
{/* TRANSACTION FORM */}
{/* TRANSACTION FORM */}
{userRole === "CLIENT" && (
  <section className="transaction-section">
  <div className="section-heading">
    <h2>Manage Transactions</h2>

    <span className="period-badge">
      Deposit / Withdrawal
    </span>
  </div>

  <div className="transaction-card">
    <form onSubmit={handleTransaction}>

      <div className="form-group">
        <label>Transaction Type</label>

        <select
          value={transactionType}
          onChange={(event) =>
            setTransactionType(event.target.value)
          }
        >
          <option value="DEPOSIT">Deposit</option>
          <option value="WITHDRAWAL">Withdrawal</option>
        </select>
      </div>

      <div className="form-group">
        <label>Amount (₹)</label>

        <input
          type="number"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
          placeholder="Enter amount"
          min="1"
          step="0.01"
          required
        />
      </div>

      <button
        type="submit"
        disabled={transactionLoading}
      >
        {transactionLoading
          ? "Processing..."
          : "Submit Transaction"}
      </button>

      {transactionMessage && (
        <p className="transaction-message">
          {transactionMessage}
        </p>
      )}

    </form>
  </div>
  </section>
)}
          {/* RECOMMENDATIONS */}

{userRole === "ADMIN" || userRole === "ADVISOR" ? (
  <section>
    <div className="section-heading">
      <h2>Management Overview</h2>

      <span className="period-badge">
        System Insights
      </span>
    </div>

    <div id="recommendation-container">
      <p>
        Total registered clients: {data?.clients ?? 0}
      </p>

      <p>
        Total managed accounts: {data?.accounts ?? 0}
      </p>

      <p>
        Total holdings: {data?.holdings ?? 0}
      </p>

      <p>
        Total assets: ₹
        {Number(
          data?.total_assets ?? 0
        ).toLocaleString("en-IN")}
      </p>
    </div>
  </section>
) : (
  <section>
    <div className="section-heading">
      <h2>Wealth Recommendation</h2>

      <span className="period-badge">
        AI Insights
      </span>
    </div>

    <div id="recommendation-container">

  {recommendationLoading && (
    <p>Loading recommendation...</p>
  )}

  {recommendationError && (
    <p>{recommendationError}</p>
  )}

  {recommendation && (
    <div className="recommendation-card">

      <h3>
        {recommendation.recommendation.action}
      </h3>

      <p>
        {recommendation.recommendation.reason}
      </p>

      <p>
        <strong>Risk Category:</strong>{" "}
        {recommendation.risk_profile.category}
      </p>

      <p>
        <strong>Monthly Requirement:</strong> ₹
        {recommendation.monthly_requirement}
      </p>

      <h4>Suggested Asset Allocation</h4>

      <p>
        Equity:{" "}
        {recommendation.suggested_allocation.equity}%
      </p>

      <p>
        Bonds:{" "}
        {recommendation.suggested_allocation.bonds}%
      </p>

      <p>
        Cash:{" "}
        {recommendation.suggested_allocation.cash}%
      </p>

      <h4>Risk Guidance</h4>

      <p>
        {recommendation.recommendation.risk_guidance}
      </p>

    </div>
  )}

  {!recommendation &&
    !recommendationLoading &&
    !recommendationError && (
      <p>
        Select a financial goal to view your recommendation.
      </p>
    )}

</div>
  </section>
)}
{/* PORTFOLIO HOLDINGS */}
{userRole === "CLIENT" && (
  <section>
    <div className="section-heading">
      <h2>Portfolio Holdings</h2>

      <span className="period-badge">
        Investments
      </span>
    </div>

    <div id="holdings-container">
  {holdings.length > 0 ? (
    holdings.map((holding) => (
      <div className="holding-card" key={holding.id}>
        <h3>{holding.symbol}</h3>

        <p>
          Quantity: {holding.quantity}
        </p>

        <p>
          Average Cost: ₹
          {Number(holding.average_cost).toLocaleString("en-IN")}
        </p>

        <p>
          Current Price: ₹
          {Number(holding.current_price).toLocaleString("en-IN")}
        </p>

        <p>
          Market Value: ₹
          {Number(holding.market_value).toLocaleString("en-IN")}
        </p>
      </div>
    ))
  ) : (
    <p>No portfolio holdings found.</p>
  )}
</div>
  </section>
)}

 
        </main>
      </div>
    </div>
  );
}

export default Dashboard;