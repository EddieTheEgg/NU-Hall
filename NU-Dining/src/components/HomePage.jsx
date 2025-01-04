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
    const [userNutritionFocus, setUserNutritionFocus] = useState({});
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
    
            if (typeof parsedData.nutritionalFocus === 'object' && parsedData.nutritionalFocus !== null) {
                setUserNutritionFocus(parsedData.nutritionalFocus);
            } else {
                setUserNutritionFocus({});
            }
        }
    }, []);
    
    const handleGoalChange = (nutrient, type, value) => {
        setUserNutritionFocus((prevFocus) => ({
            ...prevFocus,
            [nutrient]: {
                ...prevFocus[nutrient],
                [type]: value, // Update either 'min' or 'max'
            },
        }));
    };

    const selectedNutrientType = (nutrient) => {
        return nutrient in userNutritionFocus;
    };

    const handleNutrientFocus = (nutrient) => {
        setUserNutritionFocus((prevFocus) => {
            const updatedFocus = { ...prevFocus };
    
            if (updatedFocus[nutrient]) {
                delete updatedFocus[nutrient];
            } else {
                updatedFocus[nutrient] = { min: 0, max: 0 };
            }
            return updatedFocus;
        });
    };

    


    
    
    
    const handleMakeMealClick = () => {
        navigate('/meal-preferences');
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
                    {console.log('userNutritionFocus:', userNutritionFocus)}
                    return (
                        <div>
                            <h2>Your Nutritional Goals</h2>
                            <p>Edit your nutritional goals here and remember to save!</p>
                            <form onSubmit={handleSubmit} className="nutritionalEdit-form">
                                <hr />
                                {nutrients.map((nutrient) => (
                                    <div key={nutrient} className="nutrient">
                                            <div className="nutrient-focused">
                                                <button
                                                    type="button"
                                                    className={selectedNutrientType(nutrient) ? 'nutrient-button-active' : 'nutrient-button-nonactive'}
                                                    onClick={() => handleNutrientFocus(nutrient)}
                                                    >
                                                    {nutrient}
                                                </button>
                
                                                <div className= {userNutritionFocus[nutrient] ? "range-inputs visible" : "range-inputs"}>
                                                    <div className="range-pointer">▶</div>
                                                    <section className="edit-range-section">
                                                        <label>Min:</label>
                                                        <input
                                                            type="number"
                                                            placeholder={userNutritionFocus[nutrient]?.min ?? "0"}
                                                            value={userNutritionFocus[nutrient]?.min ?? ""}
                                                            onChange={(e) => handleGoalChange(nutrient, "min", e.target.value)}
                                                            required
                                                        />
                                                    </section>
                                                    <section className="edit-range-section">
                                                        <label>Max:</label>
                                                        <input
                                                            type="number"
                                                            placeholder={userNutritionFocus[nutrient]?.max ?? "0"}
                                                            value={userNutritionFocus[nutrient]?.max ?? ""}
                                                            onChange={(e) => handleGoalChange(nutrient, "max", e.target.value)}
                                                            required
                                                        />
                                                    </section>
                                                </div>
                                            </div>
                                    </div>
                                ))}
                                <button type="submit" className="save-nutritionGoals">Save!</button>
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
