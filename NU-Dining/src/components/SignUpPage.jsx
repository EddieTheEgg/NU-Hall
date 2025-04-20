import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../context/SignupContext.jsx'; 
import { FaUser, FaLock } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import "../styles/signupform.css"; 
import axios from 'axios';

const SignUpPage = () => {
    const { signupData, setSignupData } = useSignup();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailAlreadyFound, setEmailAlreadyFound] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Current signupData in SignUpPage:", signupData); //Debugging purposes to see if inputs were saved right
        setName(signupData.name || '');
        setEmail(signupData.email || '');
        setPassword(signupData.password || '');
    }, [signupData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const checkEmailResponse = await axios.get(`http://localhost:8080/api/users/checkEmail/${email}`);
            
            if (checkEmailResponse.data === true) {
                setEmailAlreadyFound('This email was already signed up! Try logging in?');
                return;
            }

            // Create new user with required fields
            const newUser = {
                name: name,
                email: email,
                password: password,
                dietaryRestrictions: {
                    allergies: [],
                    proteinPreferences: [],
                    lifestylePreferences: [],
                    restrictedIngredients: []
                },
                nutritionalFocus: {}
            };
            const signupResponse = await axios.post('http://localhost:8080/api/users/addUser', newUser);
            if (signupResponse.data) {
                localStorage.setItem('userProfile', JSON.stringify(signupResponse.data));
                setSignupData((prevData) => ({
                    ...prevData,
                    ...signupResponse.data
                }));
                navigate('/dietary-restrictions');
            }
        } catch (error) {
            console.error("Error during signup:", error.response?.data || error.message);
        }
    };

    const handleReturnLogin = () => {
        navigate("/");
    }

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2>Welcome! Your sign up journey begins here: </h2>
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
                <div className = "emailFoundMessage">{emailAlreadyFound}</div>
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
                <button type="submit" className="next-button">Save and continue!</button>
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