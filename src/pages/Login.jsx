
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
        email: email,
        password: password,
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
        console.error("STATUS:", error.response.status);
        console.error("DATA:", error.response.data);

        setError(
          error.response.data?.error ||
          `Backend error: ${error.response.status}`
        );

      } else if (error.request) {
        console.error("REQUEST:", error.request);

        setError(
          "Cannot connect to Flask backend. Make sure Flask is running."
        );

      } else {
        console.error("MESSAGE:", error.message);

        setError(
          `Request error: ${error.message}`
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>Nexgile WealthAgent</h1>

        <p>Sign in to your account</p>

        <form onSubmit={handleLogin}>

          <div>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;