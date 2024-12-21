import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../context/SignupContext.jsx'; // Assuming you have a context for managing signup data
import { FaUser, FaLock} from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import "../styles/signupform.css"; 

const SignUpPage = () => {
    const { setSignupData } = useSignup();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setSignupData((prevData) => ({
            ...prevData,
            name,
            email,
            password,
        }));
        navigate('/dietary-restrictions'); // Navigate to dietary restrictions page
    };

    const handleReturnLogin = () => {
        navigate("/");
    }

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
            <h2>Welcome! Start creating your account below!</h2>
                <div className="input-box-signup">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                <FaUserPen className="icon"/>   
                </div>
                <div className="input-box-signup">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FaUser className="icon"/>
                </div>
                <div className="input-box-signup">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaLock className="icon"/>
                </div>

              
                <button type="submit" className = "next-button">Next</button>
                <div className="return-to-login">
                    <p>Have an account? 
                        <a onClick={handleReturnLogin}> Log in!</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SignUpPage;