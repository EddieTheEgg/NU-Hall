import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/homePage.css"; 

const HomePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('Home'); 
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

    const renderContent = () => {
        switch (activeTab) {
            case 'Home':
                return (
                    <div>
                        {userProfile && userProfile.name ? (
                            <h2>Hello {userProfile.name}!</h2>
                        ) : (
                            <h2>Welcome!</h2>
                        )}
                        <p>When you are ready to make your meals, click below to begin!</p>
                        <p>Have any new updates to your dietary restrictions or nutritional goals? Update them in the sidebar to the left!</p>
                        <button onClick={handleMakeMealClick}>Create!</button>
                    </div>
                );
            case 'Nutrition':
                return (
                    <div>
                        <h2>Nutrition Information</h2>
                        <p>Details about your nutrition...</p>
                    </div>
                );
            case 'Dietary Restriction':
                return (
                    <div>
                        <h2>Dietary Restrictions</h2>
                        <p>Customize your dietary preferences...</p>
                    </div>
                );
            case 'Personal':
                return (
                    <div>
                        <h2>Personal Information</h2>
                        <p>Update your personal details...</p>
                    </div>
                );
            default:
                return <div><h2>Welcome!</h2></div>;
        }
    };

    return (
        <>  
        <section className="homepage-container">
            <section className="sidebar">
                <ul>
                    <li 
                        onClick={() => setActiveTab('Home')} 
                        className={activeTab === 'Home' ? 'active-tab' : ''}
                    >
                        Home
                    </li>
                    <li 
                        onClick={() => setActiveTab('Nutrition')} 
                        className={activeTab === 'Nutrition' ? 'active-tab' : ''}
                    >
                        Nutrition
                    </li>
                    <li 
                        onClick={() => setActiveTab('Dietary Restriction')} 
                        className={activeTab === 'Dietary Restriction' ? 'active-tab' : ''}
                    >
                        Dietary Restriction
                    </li>
                    <li 
                        onClick={() => setActiveTab('Personal')} 
                        className={activeTab === 'Personal' ? 'active-tab' : ''}
                    >
                        Personal
                    </li>
                </ul>
            </section>
            <section className="main-content">
                {renderContent()}
            </section>
        </section>
        </>
    );
};

export default HomePage;
