import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../context/SignupContext.jsx'; 
import { FaUser, FaLock } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import "../styles/signupform.css"; 

const SignUpPage = () => {
    const { signupData, setSignupData } = useSignup();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Current signupData in SignUpPage:", signupData); //Debugging purposes to see if inputs were saved right
        setName(signupData.name || '');
        setEmail(signupData.email || '');
        setPassword(signupData.password || '');
    }, [signupData]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSignupData((prevData) => ({
            ...prevData,
            name,
            email,
            password,
        }));
        navigate('/dietary-restrictions');
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
                <button type="submit" className="next-button">Next</button>
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