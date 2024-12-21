import React, { useState } from "react";
import { useSignup } from '../context/SignupContext.jsx'; // Assuming you have a context for managing signup data
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NutritionalPreferencesForm = () => {
    const { signupData, setSignupData } = useSignup();
    const [nutrition, setNutrition] = useState({});
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

    const handleCheckboxChange = (nutrient) => {
        setNutrition((prev) => ({
            ...prev,
            [nutrient]: prev[nutrient] ? undefined : { min: "", max: "" },
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
        const formattedNutrition = Object.entries(nutrition)
            .filter(([_, value]) => value)
            .reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    [key]: { min: parseInt(value.min, 10), max: parseInt(value.max, 10) },
                }),
                {}
            );

        // Combine all data and send to backend
        const finalData = {
            ...signupData,
            nutritionalPreferences: formattedNutrition,
        };

        try {
            await axios.post("http://localhost:8080/api/users/signup", finalData);
            navigate('/home'); // Navigate to home page after successful signup
        } catch (error) {
            console.error("Signup error:", error);
            // Handle error (e.g., show a message)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Alrighty! Let’s move on to your nutritional preferences.</h2>
            <p>Choose the nutritional information that applies to you, and provide a numerical value (min input and max input) is considered your daily goal for them!</p>

            {nutrients.map((nutrient) => (
                <div key={nutrient}>
                    <label>
                        {nutrient}:
                        <input
                            type="number"
                            placeholder="Min"
                            value={nutrition[nutrient]?.min || ""}
                            onChange={(e) => handleRangeChange(nutrient, "min", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={nutrition[nutrient]?.max || ""}
                            onChange={(e) => handleRangeChange(nutrient, "max", e.target.value)}
                        />
                    </label>
                </div>
            ))}

            <button type="submit">Submit</button>
        </form>
    );
};

export default NutritionalPreferencesForm;
