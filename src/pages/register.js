// rfce 
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../styles/register.css';
import axios from "axios";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [existErrors, setExistErrors] = useState({});
  const [registerError, setRegisterError] = useState("");

  const validateRegister = () => {
    const newErrors = {};

    if(!name.trim()) {
      newErrors.name = true;
    }

    if(!username.trim()) {
      newErrors.username = true;
    }

    if(!email.trim()) {
      newErrors.email = true;
    }

    if(!password.trim()) {
      newErrors.password = true;
    }

    if(!confirmPassword.trim()) {
      newErrors.confirmPassword = true;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  return (
    <div className="register">
      <div className="outer-layer">
        <div className="register-container">
          <div className="register-card">

            <div className="logo-box">📩</div>

            <h1 className="title">MailQuest</h1>
            <p className="subtitle">Register Page</p>

            <div className="input-group">
              <input
                type="text"
                placeholder="Name" 
                value={name}
                onChange={(e)=>{
                  setName(e.target.value);

                  setErrors(prev=>({
                    ...prev,
                    name: false
                  }));

                  setExistErrors(prev=>({
                    ...prev,
                    name: false
                  }));

                  setRegisterError("");
                }}

                className={
                  errors.name || existErrors.name
                  ? "error-input"
                  : ""
                }
              />

              {errors.name && (
                <p className="error-message">
                  (this field is required)
                </p>
              )}

              {existErrors.name && (
                <p className="error-message">
                  (a field with this name is already existed)
                </p>
              )}
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Username (NIM / Lecturer’s Code)"
                value={username}
                onChange={(e)=>{
                  setUsername(e.target.value);

                  setErrors(prev=>({
                    ...prev,
                    username: false
                  }));

                  setExistErrors(prev=>({
                    ...prev,
                    username: false
                  }));

                  setRegisterError("");
                }}

                className={
                  errors.username || existErrors.username
                  ? "error-input"
                  : ""
                }
              />

              {errors.username && (
                <p className="error-message">
                  (this field is required)
                </p>
              )}

              {existErrors.username && (
                <p className="error-message">
                  (a field with this name is already existed)
                </p>
              )}
            </div>
            
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>{
                  setEmail(e.target.value);

                  setErrors(prev=>({
                    ...prev,
                    email: false
                  }));

                  setExistErrors(prev=>({
                    ...prev,
                    email: false
                  }));

                  setRegisterError("");
                }}

                className={
                  errors.email || existErrors.email
                  ? "error-input"
                  : ""
                }
              />

              {errors.email && (
                <p className="error-message">
                  (this field is required)
                </p>
              )}

              {existErrors.email && (
                <p className="error-message">
                  (a field with this name is already existed)
                </p>
              )}
            </div>
            
            {/* 🔥 PASSWORD */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e)=>{
                  setPassword(e.target.value);

                  setErrors(prev=>({
                    ...prev,
                    password: false
                  }));

                  setExistErrors(prev=>({
                    ...prev,
                    password: false
                  }));

                  setRegisterError("");
                }}

                className={
                  errors.password || existErrors.password
                  ? "error-input"
                  : ""
                }
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

              {existErrors.password && (
                <p className="error-message">
                  (a field with this name is already existed)
                </p>
              )}
            </div>
            
            {/* 🔥 CONFIRM PASSWORD */}
            <div className="input-group">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e)=>{
                  setConfirmPassword(e.target.value);

                  setErrors(prev=>({
                    ...prev,
                    confirmPassword: false
                  }));

                  setExistErrors(prev=>({
                    ...prev,
                    confirmPassword: false
                  }));

                  setRegisterError("");
                }}

                className={
                  errors.confirmPassword || existErrors.confirmPassword
                  ? "error-input"
                  : ""
                }
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "🙈" : "👁️"}
              </span>

              {errors.confirmPassword && (
                <p className="error-message">
                  (this field is required)
                </p>
              )}

              {existErrors.confirmPassword && (
                <p className="error-message">
                  (a field with this name is already existed)
                </p>
              )}
            </div>

            {password &&
             confirmPassword &&
             password !== confirmPassword && (
              <p className="error-message">
                Paswords do not match!
              </p>
            )}

            {registerError && (
              <p className="register-error">
                {registerError}
              </p>
            )}
            
            <button
              className="register-btn"
              onClick={async () => {
                if(!validateRegister()) return;

                if(password !== confirmPassword) {
                  setRegisterError("Passwords do not match");
                  return;
                }

                try {
                  const response = await axios.post(
                    "http://127.0.0.1:8000/auth/register",
                    {
                      name: name,
                      username: username,
                      email: email,
                      password: password,
                      confirmPassword: confirmPassword
                    }
                  );

                  console.log("Registration success: ", response.data);

                  setName("");
                  setUsername("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");

                  setErrors({});
                  setExistErrors({});
                  setRegisterError("");

                  alert("Registration successful!");
                } catch(error) {
                  console.error("Registration error: ", error);

                  setExistErrors({});
                  setRegisterError("");

                  if(error.response) {
                    const detail = error.response.data?.detail;

                    if(
                      typeof detail === "string" &&
                      detail.toLowerCase().includes("username")
                    ) {
                      setExistErrors({
                        name: true,
                        username: true,
                        email: true,
                        password: true,
                        confirmPassword: true
                      });
                      return;
                    }

                    if (
                      typeof detail === "string" &&
                      detail.toLowerCase().includes("email")
                    ) {
                      setExistErrors({
                        email: true
                      });
                      return;
                    }

                    else if (
                      typeof detail === "string" &&
                      detail.toLowerCase().includes("name")
                    ) {
                      setExistErrors({
                        name: true
                      });
                      return;
                    }

                    setRegisterError(detail || "Registration failed.")
                  } else {
                    setRegisterError("Cannot connect to the server.");
                  }
                }
              }}
            >
              Register
            </button>

            <p className="login-text">
              Already have an account?{" "}
              <span onClick={() => navigate('/login')}>
                Log In
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;