import React, { useState } from "react";
import { useSignup } from '../context/SignupContext.jsx'; // Assuming you have a context for managing signup data
import { useNavigate } from 'react-router-dom';

const DietaryRestrictionsForm = () => {
    const { setSignupData } = useSignup();
    const [allergies, setAllergies] = useState([]);
    const [proteinPreferences, setProteinPreferences] = useState([]);
    const [lifestylePreferences, setLifestylePreferences] = useState([]);
    const [restrictedIngredients, setRestrictedIngredients] = useState("");
    const navigate = useNavigate();

    const handleCheckboxChange = (setState, value) => (e) => {
        setState((prev) =>
            e.target.checked
                ? [...prev, value]
                : prev.filter((item) => item !== value)
        );
    };

    const parseOtherPreferences = (input) => {
        return input
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dietaryRestrictions = {
            allergies,
            proteinPreferences,
            lifestylePreferences,
            restrictedIngredients: parseOtherPreferences(restrictedIngredients),
        };
        setSignupData((prevData) => ({
            ...prevData,
            dietaryRestrictions,
        }));
        navigate('/nutritional-goals'); // Navigate to nutritional preferences page
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Well hi, I’m excited to be your personal food assistant!</h2>
            <p>Do you have any dietary restrictions listed below? (You can always edit this later in your profile)</p>

            <h3>1. Allergies (Check all that apply):</h3>
            {["Gluten", "Soy", "Dairy", "Egg", "Peanuts", "Tree Nuts", "Sesame", "Mustard", "Celery", "Sulphites", "MSG", "Onion", "Garlic", "Seafood/Fish"].map((item) => (
                <label key={item}>
                    <input
                        type="checkbox"
                        onChange={handleCheckboxChange(setAllergies, item)}
                    />
                    {item}
                </label>
            ))}

            <h3>2. Protein or Food Source Preferences:</h3>
            {["Avoid Beef", "Avoid Pork", "Avoid Poultry", "Avoid Alcohol"].map((item) => (
                <label key={item}>
                    <input
                        type="checkbox"
                        onChange={handleCheckboxChange(setProteinPreferences, item)}
                    />
                    {item}
                </label>
            ))}

            <h3>3. Lifestyle Preferences:</h3>
            {["Vegetarian", "Vegan"].map((item) => (
                <label key={item}>
                    <input
                        type="checkbox"
                        onChange={handleCheckboxChange(setLifestylePreferences, item)}
                    />
                    {item}
                </label>
            ))}

            <h3>4. Any Other Restrictions or Preferences?</h3>
            <textarea
                value={restrictedIngredients}
                onChange={(e) => setRestrictedIngredients(e.target.value)}
                placeholder="Enter ingredients separated by commas, e.g., Mushroom, Pineapple"
            />

            <button type="submit">Next</button>
        </form>
    );
};

export default DietaryRestrictionsForm;
