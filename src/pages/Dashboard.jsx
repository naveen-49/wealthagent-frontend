import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard/client/full");

        console.log("DASHBOARD DATA:", response.data);

        setData(response.data);

      } catch (error) {
        console.error("DASHBOARD ERROR:", error);

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

  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>

      <h1>Nexgile WealthAgent</h1>

      <h2>
        Welcome, {data?.client?.name}
      </h2>

      <section>
        <h3>Financial Summary</h3>

        <p>
          Cash: ₹{data?.financial_summary?.cash}
        </p>

        <p>
          Portfolio Value: ₹
          {data?.financial_summary?.portfolio_value}
        </p>

        <p>
          Total Assets: ₹
          {data?.financial_summary?.total_assets}
        </p>
      </section>

      <section>
        <h3>Risk Profile</h3>

        {data?.risk_profile ? (
          <>
            <p>
              Score: {data.risk_profile.score}
            </p>

            <p>
              Category: {data.risk_profile.category}
            </p>
          </>
        ) : (
          <p>No risk profile available.</p>
        )}
      </section>

      <section>
        <h3>Financial Goals</h3>

        {data?.goals?.length > 0 ? (
          data.goals.map((goal) => (
            <div key={goal.id}>
              <h4>{goal.name}</h4>

              <p>
                Target: ₹{goal.target_amount}
              </p>

              <p>
                Progress: {goal.progress}%
              </p>

              <p>
                Monthly Requirement: ₹
                {goal.monthly_requirement}
              </p>
            </div>
          ))
        ) : (
          <p>No financial goals found.</p>
        )}
      </section>

    </div>
  );
}

export default Dashboard;