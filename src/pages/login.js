import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../styles/login.css';
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const validateLogin = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = true;
    }

    if (!password.trim()) {
      newErrors.password = true;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="login">
      <div className="outer-layer">
        <div className="login-container">
          <div className="login-card">

            <div className="logo-box">📩</div>

            <h1 className="title">MailQuest</h1>
            <p className="subtitle">Log In Page</p>

            <div className="input-group">
              <input
                type="text"
                placeholder="Username (NIM / Lecturer’s Code)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);

                  setErrors(prev => ({
                    ...prev,
                    username: false
                  }));

                  setLoginError("");
                }}
                className={errors.username ? "error-input" : ""}
              />

              {errors.username && (
                <p className="error-message">
                  (this field is required)
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  setErrors(prev => ({
                    ...prev,
                    password: false
                  }));

                  setLoginError("");
                }}
                className={errors.password ? "error-input" : ""}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>

              {errors.password && (
                <p className="error-message">
                  (this field is required)
                </p>
              )}
            </div>

            {loginError && (
              <p className="login-error">
                {loginError}
              </p>
            )}

            {/* REMEMBER ME */}
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e)=>setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button
              className="login-btn"
              onClick={async() => {
                if(!validateLogin()) return;

                const userFound = false;

                try {
                  const response = await axios.post(
                    "http://127.0.0.1:8000/auth/login/",
                    {
                      username,
                      password,
                      remember_me: rememberMe
                    },
                    {
                      withCredentials: true
                    }
                  );

                  navigate('/letter-request');
                }

                catch(error) {
                  setLoginError("Invalid credentials")
                }
              }}
            >
              Log In
            </button>

            <p className="register-text">
              Haven’t got an account?{" "}
              <span onClick={() => navigate('/register')}>
                Register here
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;