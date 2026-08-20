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
  const [loginMessage, setLoginMessage] = useState("");
  const [messageType, setMessageType] = useState("");

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

                  setLoginMessage("");
                  setMessageType("");
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

                  setLoginMessage("");
                  setMessageType("");
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

            {loginMessage && (
              <p className={`login-message ${messageType}`}>
                {loginMessage}
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

                try {
                  const response = await axios.post(
                    "http://localhost:8000/auth/login",
                    {
                      username: username.trim(),
                      password: password,
                      remember_me: rememberMe
                    },
                    {
                      withCredentials: true
                    }
                  );

                  console.log("LOGIN SUCCESS: ", response.data);

                  if(response.data.success) {
                    if(rememberMe) {
                      setLoginMessage(
                        "Login successful! Your session will be remembered."
                      );
                    } else {
                      setLoginMessage(
                        "Login successful!"
                      );
                    }

                    setMessageType("success");

                    navigate("/letter-request");
                    return;
                  }
                }

                catch(error) {
                  console.error("LOGIN ERROR: ", error);

                  if(error.response) {
                    
                    console.log("STATUS:", error.response.status);
                    console.log("BACKEND RESPONSE:", error.response.data);

                    const status = error.response.status;
                    const detail = error.response.data?.detail;

                    if(status === 401) {
                      setLoginMessage(detail || "Invalid credentials.");
                    } else if(status === 404) {
                      setLoginMessage(detail || "User not found.");
                    } else if(status === 422) {
                      setLoginMessage(detail || "Invalid input. Please check your data.");
                    } else if(status === 500) {
                      setLoginMessage("Server error. Please try again later.");
                    } else {
                      setLoginMessage(detail || "Login failed.");
                    }

                    setMessageType("error");

                  } else if (error.request) {
                    setLoginMessage("Cannot connect to the server.");
                    setMessageType("error");

                  } else {
                    setLoginMessage("An unexpected error occured.");
                    setMessageType("error");

                  }
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