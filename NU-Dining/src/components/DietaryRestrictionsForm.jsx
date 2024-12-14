import React, { useState } from "react";

const DietaryRestrictionsForm = ({ onSubmit }) => {
    // State for the different dietary restrictions categories
    const [allergies, setAllergies] = useState([]);
    const [proteinPreferences, setProteinPreferences] = useState([]);
    const [lifestylePreferences, setLifestylePreferences] = useState([]);
    const [restrictedIngredients, setRestrictedIngredients] = useState("");

    // Handle checkbox changes for each dietary restriction category
    const handleCheckboxChange = (setState, value) => (e) => {
        setState((prev) =>
            e.target.checked
                ? [...prev, value] // Add to array if checked
                : prev.filter((item) => item !== value) // Remove from array if unchecked
        );
    };

    // Convert "otherPreferences" into a list format
    const parseOtherPreferences = (input) => {
        return input
            .split(",") // Split input by commas
            .map((item) => item.trim()) // Trim spaces around each item
            .filter((item) => item); // Remove empty strings
    };

    // Prepare the data to be submitted
    const handleSubmit = (e) => {
        e.preventDefault();

        // Structure the data into categories
        const dietaryRestrictions = {
            allergies: allergies,
            proteinPreferences: proteinPreferences,
            lifestylePreferences: lifestylePreferences,
            restrictedIngredients: parseOtherPreferences(restrictedIngredients), // Convert to list
        };

        // Call the onSubmit function passed as a prop with the structured dietary restrictions
        onSubmit(dietaryRestrictions);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Dietary Restrictions</h2>
            <p>(You can always edit this later in your profile)</p>

            <h3>1. Allergies (Check all that apply):</h3>
            {[
                "Gluten",
                "Soy",
                "Dairy",
                "Egg",
                "Peanuts",
                "Tree Nuts",
                "Sesame",
                "Mustard",
                "Celery",
                "Sulphites",
                "MSG",
                "Onion",
                "Garlic",
                "Seafood/Fish",
            ].map((item) => (
                <label key={item}>
                    <input
                        type="checkbox"
                        onChange={handleCheckboxChange(setAllergies, item)}
                    />
                    {item}
                </label>
            ))}

            <h3>2. Protein or Food Source Preferences:</h3>
            {[
                "Avoid Beef",
                "Avoid Pork",
                "Avoid Poultry",
                "Avoid Alcohol",
            ].map((item) => (
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

            <h3>4. Any Other Restrictions (Ingredients)?</h3>
            <textarea
                value={restrictedIngredients}
                onChange={(e) => setRestrictedIngredients(e.target.value)}
                placeholder="Enter ingredients separated by commas, e.g., Mushroom, Pineapple"
            />

            <br />
            <button type="submit">Next</button>
        </form>
    );
};

export default DietaryRestrictionsForm;
