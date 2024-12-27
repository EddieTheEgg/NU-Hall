import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const storedData = localStorage.getItem('userProfile');
        if (storedData) {
            setUserProfile(JSON.parse(storedData)); 
        }
    }, []);

    const handleMakeMealClick = () => {
        navigate('/meal-preferences');
    };

    return (
        <>  
            <div>
                {userProfile && userProfile.name && <h1>Hello, {userProfile.name}!</h1>}
            </div>
            <section>
                <h2>Create a meal plan:</h2>
                <button type="button" onClick={handleMakeMealClick}>Make a meal!</button>
            </section>
        </>
    );
};

export default HomePage;
