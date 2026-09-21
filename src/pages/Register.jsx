
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        username: name,
        email: email,
        password: password,
      });

      console.log("REGISTER RESPONSE:", response.data);

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(
        "REGISTRATION STATUS:",
        error.response?.status
      );

      console.error(
        "REGISTRATION DATA:",
        error.response?.data
      );

      if (error.response) {
        setError(
          error.response.data?.msg ||
          error.response.data?.error ||
          error.response.data?.message ||
          `Registration failed: ${error.response.status}`
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

        {/* LEFT SIDE: REGISTRATION FORM */}
        <section className="login-form-section">

          <div className="login-form-content">

            <div className="brand-logo">
              <span className="brand-symbol">✦</span>
              <span>Nexgile</span>
            </div>

            <h1>Create Your Account</h1>

            <p className="login-subtitle">
              Start managing your wealth with confidence.
            </p>

            <form onSubmit={handleRegister}>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                />
              </div>

              {error && (
                <div className="auth-message error">
                  {error}
                </div>
              )}

              {success && (
                <div className="auth-message success">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>

            <p className="register-link">
              Already have an account?{" "}
              <Link to="/login">Sign In</Link>
            </p>

          </div>

        </section>

        {/* RIGHT SIDE: INFORMATION */}
        <section className="login-info-section">

          <div className="login-info-content">

            <div className="info-brand">
              <span>✦</span>
              Nexgile WealthAgent
            </div>

            <h2>
              Your Wealth.
              <br />
              Your Future.
            </h2>

            <p>
              Take control of your financial journey with
              intelligent investment management and
              personalized wealth insights.
            </p>

            <div className="info-features">
              <div className="info-feature">
                <span>✓</span>
                Secure account management
              </div>

              <div className="info-feature">
                <span>✓</span>
                Personalized financial insights
              </div>

              <div className="info-feature">
                <span>✓</span>
                Track your investments easily
              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Register;