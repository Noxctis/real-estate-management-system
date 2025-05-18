import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({
    length: false,
    letter: false,
    number: false,
    special: false,
  });

  const navigate = useNavigate();

  const checkStrength = (pwd) => {
    setStrength({
      length: pwd.length >= 8,
      letter: /[A-Za-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkStrength(e.target.value);
            }}
          />
          <button
            type="button"
            className="show-password-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? "Hide Password" : "Show Password"}
          </button>
          <div className="password-strength">
            <div className={strength.length ? "valid" : "invalid"}>
              <span>●</span> At least 8 characters
            </div>
            <div className={strength.letter ? "valid" : "invalid"}>
              <span>●</span> Contains a letter
            </div>
            <div className={strength.number ? "valid" : "invalid"}>
              <span>●</span> Contains a number
            </div>
            <div className={strength.special ? "valid" : "invalid"}>
              <span>●</span> Contains a special character
            </div>
            <div
              className="progress-bar"
              style={{
                width: (Object.values(strength).filter(Boolean).length / 4) * 100 + "%",
              }}
            />
          </div>
          <button disabled={isLoading}>Register</button>
          {error && <span className="error-message">{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
