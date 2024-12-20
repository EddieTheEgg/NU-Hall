import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import "../styles/loginform.css"; 

const UserLoginForm = ({ onSubmit }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/users/login", {
                email,
                password
            });

            if (response.data === "Login successful") {
                setErrorMessage(""); // Clear any previous error message
                onSubmit({ email, password }); 
            } else {
                setErrorMessage("Email or password mismatch."); 
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("The email or password is incorrect."); 
            } else {
                console.error("Login error:", error);
                setErrorMessage("An error occurred. Please try again."); 
            }
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaLock className="icon" />
                </div>
                <div className="remember-forgot">
                    <label>
                        <input type="checkbox" />
                        Remember me
                    </label>
                    <a href="#">Forgot password?</a>
                </div>
                
                {errorMessage && <p className="error-message">*{errorMessage}</p>} 
                <button className="login-button" type="submit">Login</button>
                
                <div className="register-link">
                    <p>Don't have an account? 
                        <a href="#"> Sign Up!</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default UserLoginForm;
