import React, { useState, useEffect } from "react";
import { useSignup } from '../context/SignupContext.jsx'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveToLocalStorage } from '../utils/localStorageUtils';
import "../styles/nutritionalform.css"; 

const NutritionalPreferencesForm = () => {
    const { signupData, setSignupData } = useSignup();
    const [nutrition, setNutrition] = useState({});
    const [selectedNutrients, setSelectedNutrients] = useState({}); 
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);

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
        // Load saved nutritional preferences into the state
        setNutrition(signupData.nutritionalFocus || {});
    }, [signupData]);

    useEffect(() => {
        const storedData = localStorage.getItem('userProfile');
        if (storedData) {
            setUserProfile(JSON.parse(storedData));
        }
    }, []);

    const handleButtonClick = (nutrient) => {
        setNutrition((prev) => ({
            ...prev,
            [nutrient]: prev[nutrient] ? undefined : { min: "", max: "" },
        }));
        setSelectedNutrients((prev) => ({
            ...prev,
            [nutrient]: !prev[nutrient], 
        }));
    };

    const handleRangeChange = (nutrient, key, value) => {
        setNutrition((prev) => ({
            ...prev,
            [nutrient]: { ...prev[nutrient], [key]: value },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Format the nutrition data correctly
        const formattedNutrition = {};
        
        // Only include nutrients that have been selected and have values
        Object.entries(nutrition).forEach(([nutrient, values]) => {
            if (values && (values.min !== "" || values.max !== "")) {
                formattedNutrition[nutrient] = {
                    min: values.min ? parseFloat(values.min) : 0,
                    max: values.max ? parseFloat(values.max) : 0
                };
            }
        });

        try {
            const response = await axios.put(
                `http://localhost:8080/api/users/updateNutritionFocus/${userProfile.email}`,
                formattedNutrition,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                localStorage.setItem('userProfile', JSON.stringify(response.data));
                navigate('/home');
            }
        } catch (error) {
            console.error("Error updating nutritional preferences:", error);
            if (error.response) {
                console.log('Error response data:', error.response.data);
                console.log('Error response status:', error.response.status);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="nutritionalPref-form">
            <h2>Thanks! We're almost done, now we need to set up your goals!</h2>
            <p>Choose the relevant nutritional goals below that apply to you!</p>
            <p>Then provide the numerical range (min ~ max) that represents your daily goal for that nutrient!</p>
            <hr />
            {nutrients.map((nutrient) => (
                <div key={nutrient} className="nutrient-type">
                    <button
                        type="button"
                        className={`nutrient-button ${selectedNutrients[nutrient] ? 'active' : 'non-active'}`}
                        onClick={() => handleButtonClick(nutrient)}
                    >
                        {nutrient}
                    </button>
                    <div className={`range-inputs ${selectedNutrients[nutrient] ? 'visible' : ''}`}>
                        {selectedNutrients[nutrient] && ( 
                            <>
                            <div className="arrow">▶</div>
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
                                <label>Max: </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={nutrition[nutrient]?.max || ""}
                                    onChange={(e) => handleRangeChange(nutrient, "max", e.target.value)}
                                />
                            </section>
                            </>
                        )}
                    </div>
                </div>
            ))}

            <p>*Note: You can always edit your information in settings!</p>
            <button type="submit" className="submit-signupButton">Save and submit!</button>
        </form>
    );
};

export default NutritionalPreferencesForm;

