import React, { useState } from "react";

const MealPreferencesForm = ({ onSubmit }) => {
    const [periods, setPeriods] = useState([]);
    const [locations, setLocations] = useState([]);
    const [kitchens, setKitchens] = useState([]);

    // Mapping of locations to kitchens and their availability
    const locationToKitchens = {
        "Stetson_East": {
            kitchens: ["CUCINA", "RICE STATION", "HOMESTYLE", "GLOBAL EATS", "MENUTAINMENT", "FLAME", "DELI", "DELI SPECIAL", "SOUP", "FRESH 52 A", "FRESH 52 B", "PURE EATS", "SWEET SHOPPE"],
            availability: {
                "Breakfast": ["CUCINA", "RICE STATION", "HOMESTYLE", "MENUTAINMENT", "SOUP", "FRESH 52 B", "SWEET SHOPPE"],
                "Lunch": ["CUCINA", "RICE STATION", "HOMESTYLE", "GLOBAL EATS", "MENUTAINMENT", "FLAME", "DELI", "DELI SPECIAL", "SOUP", "FRESH 52 A", "FRESH 52 B", "PURE EATS", "SWEET SHOPPE"],
                "Dinner": ["CUCINA", "RICE STATION", "HOMESTYLE", "GLOBAL EATS", "MENUTAINMENT", "FLAME", "DELI", "DELI SPECIAL", "SOUP", "FRESH 52 A", "FRESH 52 B", "PURE EATS", "SWEET SHOPPE"],
            }
        },
        "Stetson_West": {
            kitchens: ["GARDEN SOCIAL", "HEART OF THE HOUSE", "LET'S TOAST", "FLOUR + SAUCE", "SWEET HOUSE", "SOUP & CO", "THE STUDIO ENTREE", "THE STUDIO TOPPINGS", "THE STUDIO PROTEIN"],
            availability: {
                "Breakfast": [],
                "Lunch": ["GARDEN SOCIAL", "HEART OF THE HOUSE", "LET'S TOAST", "FLOUR + SAUCE", "SWEET HOUSE", "SOUP & CO"],
                "Dinner": ["GARDEN SOCIAL", "HEART OF THE HOUSE", "LET'S TOAST", "FLOUR + SAUCE", "SWEET HOUSE", "SOUP & CO", "THE STUDIO ENTREE", "THE STUDIO TOPPINGS", "THE STUDIO PROTEIN"],
            }
        },
        "IV": {
            kitchens: ["SWEETS AT THE TABLE", "ASIAN KITCHEN", "UNITED KITCHEN", "FUSION GRILL", "SOUP", "LATIN KITCHEN", "DELICIOUS WITHOUT", "KOSHER DELI", "POMODORO KITCHEN", "SPICE BOWL", "MEZZE TABLE", "SUSHI", "ASIAN KITCHEN TOPPINGS", "GLOBAL BOWLS"],
            availability: {
                "Breakfast": ["SWEETS AT THE TABLE", "ASIAN KITCHEN", "UNITED KITCHEN", "FUSION GRILL", "SOUP"],
                "Lunch": ["LATIN KITCHEN", "DELICIOUS WITHOUT", "KOSHER DELI", "POMODORO KITCHEN", "SPICE BOWL", "SWEETS AT THE TABLE", "MEZZE TABLE", "SUSHI", "ASIAN KITCHEN", "ASIAN KITCHEN TOPPINGS", "UNITED KITCHEN", "FUSION GRILL", "GLOBAL BOWLS", "SOUP"],
                "Dinner": ["LATIN KITCHEN", "DELICIOUS WITHOUT", "KOSHER DELI", "POMODORO KITCHEN", "SPICE BOWL", "SWEETS AT THE TABLE", "MEZZE TABLE", "SUSHI", "ASIAN KITCHEN", "ASIAN KITCHEN TOPPINGS", "UNITED KITCHEN", "FUSION GRILL", "GLOBAL BOWLS", "SOUP"],
            }
        },
    };

    // Dynamically filter kitchens based on selected locations and periods
    const availableKitchens = locations.flatMap((location) => {
        const kitchens = locationToKitchens[location]?.kitchens || [];
        const availablePeriods = periods.length > 0 ? periods : Object.keys(locationToKitchens[location].availability);
        return kitchens.filter(kitchen => 
            availablePeriods.some(period => 
                locationToKitchens[location].availability[period].includes(kitchen)
            )
        );
    });

    // Toggle selection for buttons
    const toggleSelection = (value, state, setState) => {
        if (state.includes(value)) {
            setState(state.filter((item) => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ periods, locations, kitchens });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Select Your Preferences</h3>
            
            {/* Meal Periods */}
            <div>
                <label>Meal Periods (Select up to 3):</label>
                <div>
                    {["Breakfast", "Lunch", "Dinner"].map((period) => (
                        <button
                            type="button"
                            key={period}
                            onClick={() => toggleSelection(period, periods, setPeriods)}
                            style={{
                                backgroundColor: periods.includes(period) ? "#007bff" : "#f0f0f0",
                                color: periods.includes(period) ? "#fff" : "#000",
                            }}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* Locations */}
            <div>
                <label>Locations:</label>
                <div>
                    {["Stetson_East", "Stetson_West", "IV"].map((location) => (
                        <button
                            type="button"
                            key={location}
                            onClick={() => {
                                toggleSelection(location, locations, setLocations);
                                setKitchens([]); // Reset kitchens when locations change
                            }}
                            style={{
                                backgroundColor: locations.includes(location) ? "#007bff" : "#f0f0f0",
                                color: locations.includes(location) ? "#fff" : "#000",
                            }}
                        >
                            {location.replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Kitchens */}
            <div>
                <label>Kitchens:</label>
                <div>
                    {locations.map((location) => (
                        <div key={location}>
                            <h4>{location.replace("_", " ")}</h4>
                            {availableKitchens.length > 0 ? (
                                availableKitchens.map((kitchen, index) => {
                                    if (locationToKitchens[location].kitchens.includes(kitchen)) {
                                        return (
                                            <button
                                                type="button"
                                                key={index}
                                                onClick={() => toggleSelection(kitchen, kitchens, setKitchens)}
                                                style={{
                                                    backgroundColor: kitchens.includes(kitchen) ? "#007bff" : "#f0f0f0",
                                                    color: kitchens.includes(kitchen) ? "#fff" : "#000",
                                                }}
                                            >
                                                {kitchen}
                                            </button>
                                        );
                                    }
                                    return null;
                                })
                            ) : (
                                <p>No kitchens available. Select a location first.</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit">Next</button>
        </form>
    );
};

export default MealPreferencesForm;