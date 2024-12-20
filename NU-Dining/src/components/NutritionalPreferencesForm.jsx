import React, { useState } from "react";

const NutritionalPreferencesForm = ({ onSubmit }) => {
    // State to manage selected nutrition preferences and their ranges
    const [nutrition, setNutrition] = useState({});
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedNutrition = Object.entries(nutrition)
            .filter(([_, value]) => value) // Only include selected nutrients
            .reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    [key]: { min: parseInt(value.min, 10), max: parseInt(value.max, 10) },
                }),
                {}
            );
        onSubmit(formattedNutrition);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Nutritional Preferences</h2>
            <p>Select the nutritional preferences you want to specify a range for: These will be your daily goals for 3 meals. You can always edit later.</p>

            {nutrients.map((nutrient) => (
                <div key={nutrient}>
                    <label>
                        <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(nutrient)}
                            checked={!!nutrition[nutrient]}
                        />
                        {nutrient}
                    </label>
                    {nutrition[nutrient] && (
                        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                            <label>
                                Min:
                                <input
                                    type="number"
                                    value={nutrition[nutrient].min}
                                    onChange={(e) =>
                                        handleRangeChange(nutrient, "min", e.target.value)
                                    }
                                    placeholder="Min value"
                                />
                            </label>
                            <label style={{ marginLeft: "10px" }}>
                                Max:
                                <input
                                    type="number"
                                    value={nutrition[nutrient].max}
                                    onChange={(e) =>
                                        handleRangeChange(nutrient, "max", e.target.value)
                                    }
                                    placeholder="Max value"
                                />
                            </label>
                        </div>
                    )}
                </div>
            ))}

            <br />
            <button type="submit">Submit</button>
        </form>
    );
};

export default NutritionalPreferencesForm;
