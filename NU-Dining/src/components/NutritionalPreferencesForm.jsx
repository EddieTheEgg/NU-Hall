import React, { useState } from "react";
import { useSignup } from '../context/SignupContext.jsx'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/nutritionalform.css"; 

const NutritionalPreferencesForm = () => {
    const { signupData, setSignupData } = useSignup();
    const [nutrition, setNutrition] = useState({});
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
        console.log(`Changing ${key} for ${nutrient} to ${value}`);
        setNutrition((prev) => ({
            ...prev,
            [nutrient]: { ...prev[nutrient], [key]: value },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedNutrition = Object.entries(nutrition)
            .filter(([_, value]) => value)
            .reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    [key]: { min: parseInt(value.min, 10), max: parseInt(value.max, 10) },
                }),
                {}
            );

       
        const finalData = {
            ...signupData,
            nutritionalFocus: formattedNutrition,
        };

        try {
            await axios.post("http://localhost:8080/api/users/addUser", finalData);
            navigate('/home'); // Navigate to home page after successful signup
        } catch (error) {
            console.error("Signup error:", error);
           
        }
        console.log("Nutrition data:", nutrition);
    };

    

    return (
        <form onSubmit={handleSubmit} className="nutritionalPref-form">
            <h2>Thanks! We're almost done, now we need to set up your goals!</h2>
            <p>Choose the relevant nutritional goals below that apply to you!</p>
            <p>Then provide the numerical range (min ~ max) that reprsents your daily goal for that nutrient!</p>
            <hr />
            {nutrients.map((nutrient) => (
                <div key={nutrient} className="nutrient-type">
                    <button
                        type="button"
                        className={`nutrient-button ${selectedNutrients[nutrient] ? 'active' : 'non-active'}`} // Add active class if selected
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
                            <section className= "input-section-range">
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

            <button type="submit" className="submit-signupButton">Submit</button>
        </form>
    );
};

export default NutritionalPreferencesForm;

