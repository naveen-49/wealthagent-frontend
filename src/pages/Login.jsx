
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data.access_token;

      if (!token) {
        setError("Login succeeded but no access token was returned.");
        return;
      }

      localStorage.setItem("access_token", token);

      navigate("/dashboard");
    } catch (error) {
      console.error("FULL LOGIN ERROR:", error);

      if (error.response) {
        setError(
          error.response.data?.error ||
            `Backend error: ${error.response.status}`
        );
      } else if (error.request) {
        setError(
          "Cannot connect to Flask backend. Make sure Flask is running."
        );
      } else {
        setError(`Request error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* LEFT SIDE: LOGIN FORM */}
        <div className="login-form-section">
          <div className="login-form-content">

            <div className="login-brand">
              <span className="brand-symbol">✦</span>
              <span>Nexgile</span>
            </div>

            <h1>Welcome Back!</h1>

            <p className="login-subtitle">
              Sign in to your account and continue managing your wealth.
            </p>

            <form onSubmit={handleLogin} className="login-form">

              <div className="form-group">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && <p className="login-error">{error}</p>}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>

            </form>
            <p className="register-link">
  Don't have an account?{" "}
  <span onClick={() => navigate("/register")}>
    Create Account
  </span>
</p>
            <p className="login-footer">
              Secure access to your financial dashboard
            </p>

          </div>
        </div>

        {/* RIGHT SIDE: BRANDING */}
        <div className="login-info-section">

          <div className="info-content">
            <div className="info-brand">
              <span className="brand-symbol">✦</span>
              <span>Nexgile WealthAgent</span>
            </div>

            <h2>
              Smarter Wealth.
              <br />
              Stronger Future.
            </h2>

            <p>
              Manage your investments, track your portfolio,
              and make informed financial decisions with
              Nexgile WealthAgent.
            </p>

            <div className="info-features">
              <div>✓ Portfolio Management</div>
              <div>✓ Financial Goal Tracking</div>
              <div>✓ Secure Transactions</div>
            </div>
          </div>

          <div className="info-decoration">
            <span>◈</span>
            <span>◈</span>
            <span>◈</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;