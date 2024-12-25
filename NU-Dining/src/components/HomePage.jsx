import React from 'react';
import { useSignup } from '../context/SignupContext.jsx';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const { signupData } = useSignup();
    const navigate = useNavigate();

    const handleMakeMealClick = () => {
        navigate('/meal-preferences');
    };

    return (
        <>
            <section>
                <h1>Create a meal plan:</h1>
                <button type="button" onClick={handleMakeMealClick}>Make a meal!</button>
            </section>
            <div>
                {signupData.name && <p>Hello, {signupData.name}!</p>}
                {/* Add more user-specific content here */}
            </div>
        
        </>
        
    );
};

export default HomePage;