import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { MdNoFood } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";

import "../styles/homePage.css"; 
import defaultAvatar from "../assets/default_avatar.jpg";

const HomePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('Home'); 
    const [userNutritionFocus, setUserNutritionFocus] = useState([]);
    const [selectedNutrients, setSelectedNutrients] = useState({});
    const navigate = useNavigate();

    const nutrients = [
        "Calories",
        "Protein (g)",
        "Total Carbohydrates (g)",
        "Sugar (g)",
        "Total Fat (g)",
        "Saturated Fat (g)",
        "Cholesterol (mg)",
        "Dietary Fiber (g)",
        "Sodium (mg)",
        "Potassium (mg)",
        "Calcium (mg)",
        "Iron (mg)",
        "Trans Fat (g)",
        "Vitamin D (IU)",
        "Vitamin C (mg)",
        "Calories From Fat",
        "Vitamin A (RE)",
        "Saturated Fat + Trans Fat (g)",
    ];

    useEffect(() => {
        const storedData = localStorage.getItem('userProfile');
        if (storedData) {
            const parsedData = JSON.parse(storedData); 
            setUserProfile(parsedData);

            if (parsedData.nutritionalFocus) {
                setUserNutritionFocus(parsedData.nutritionalFocus);
            }
        }
    }, []);
    

    const handleMakeMealClick = () => {
        navigate('/meal-preferences');
    };

    const handleButtonClick = (nutrient) => {
        setSelectedNutrients((prevState) => ({
            ...prevState,
            [nutrient]: !prevState[nutrient], // Toggle selection
        }));
    };

    const handleSubmit = () => {

    }
    

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
                            <h2>Your Nutritional Goals</h2>
                            <p>Edit your nutritional goals here and remember to save!</p>
                            <form onSubmit={handleSubmit} className="nutritionalEdit-form">
                                <hr />
                                {nutrients.map((nutrient) => (
                                    <div key={nutrient} className="nutrient">
                                        {console.log(userNutritionFocus)}
                                        {userNutritionFocus.includes(nutrient) ? (
                                            
                                            // If the nutrient is in userNutritionFocus, show ranges
                                            <div className="nutrient-focused">
                                                <h3>{nutrient}</h3>
                                                <div className="range-inputs visible">
                                                    <section className="input-section-range">
                                                        <label>Min:</label>
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            value={nutrition[nutrient]?.min || ""}
                                                            onChange={(e) => handleRangeChange(nutrient, "min", e.target.value)}
                                                            required
                                                        />
                                                    </section>
                                                    <section className="input-section-range">
                                                        <label>Max:</label>
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            value={nutrition[nutrient]?.max || ""}
                                                            onChange={(e) => handleRangeChange(nutrient, "max", e.target.value)}
                                                        />
                                                    </section>
                                                </div>
                                            </div>
                                        ) : (
                                            // Otherwise, display as a button
                                            <>
                                                
                                                <button
                                                    type="button"
                                                    className={`nutrient-button ${selectedNutrients[nutrient] ? 'active' : 'non-active'}`}
                                                    onClick={() => handleButtonClick(nutrient)}
                                                >
                                                    {nutrient}
                                                </button>
                                            </>
                                           
                                        )}
                                    </div>
                                ))}
                                <p>*Note: You can always edit your information in settings!</p>
                                <button type="submit" className="submit-signupButton">Save and submit!</button>
                            </form>
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
                <div className="user-profile-image">
                    <img src={defaultAvatar} alt="Default Avatar" />
                </div>
                <ul className="tabs">
                    <li 
                        onClick={() => setActiveTab('Home')} 
                        className={activeTab === 'Home' ? 'active-tab' : ''}
                    >
                        <FaHome />
                        <div>Home</div>
                    </li>
                    <li 
                        onClick={() => setActiveTab('Personal')} 
                        className={activeTab === 'Personal' ? 'active-tab' : ''}
                    >
                        <IoMdPerson />
                        <div>Personal</div>
                    </li>
                    <li 
                        onClick={() => setActiveTab('Nutrition')} 
                        className={activeTab === 'Nutrition' ? 'active-tab' : ''}
                    >
                        <GoGoal />
                        <div>Nutritional Goals</div>
                    </li>
                    <li 
                        onClick={() => setActiveTab('Dietary Restriction')} 
                        className={activeTab === 'Dietary Restriction' ? 'active-tab' : ''}
                    >
                        <MdNoFood />
                        <div>Dietary Restrictions</div>
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
