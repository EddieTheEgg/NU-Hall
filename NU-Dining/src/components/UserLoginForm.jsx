import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios"; // Import axios for making API calls
import "../styles/loginform.css"; 

const UserLoginForm = ({ onSubmit }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State for error message

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);

        try {
            // Make a POST request to your backend API
            const response = await axios.post("http://localhost:8080/api/users/login", {
                email,
                password
            });

            // Assuming the backend returns a success status
            if (response.data.success) {
                setErrorMessage(""); // Clear any previous error message
                onSubmit({ email, password }); // Proceed to the next step
            } else {
                setErrorMessage("Email or password mismatch."); // Set error message
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("An error occurred. Please try again."); // Set error message for API error
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
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
                
                <button className="login-button" type="submit">Login</button>
                
                <div className="register-link">
                    <p>Don't have an account? 
                        <a href="#"> Register</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default UserLoginForm;
