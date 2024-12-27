import React, { useState, useEffect } from "react";
import { IoCheckmarkCircle, IoCheckmarkCircleOutline } from 'react-icons/io5';
import "../styles/mealPref.css"; 
import { useNavigate } from 'react-router-dom';

const MealPreferencesForm = ({ onSubmit }) => {
    const [periods, setPeriods] = useState([]);
    const [locations, setLocations] = useState([]);
    const [kitchens, setKitchens] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentDateTime(now.toLocaleString()); 
        };
        updateDateTime(); 
        const intervalId = setInterval(updateDateTime, 1000); 

        return () => clearInterval(intervalId); 
    }, []);

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
                "Breakfast": ["No kitchens are avaliable at your chosen time"],
                "Lunch": ["GARDEN SOCIAL", "HEART OF THE HOUSE", "LET'S TOAST", "FLOUR + SAUCE", "SWEET HOUSE", "SOUP & CO"],
                "Dinner": ["GARDEN SOCIAL", "HEART OF THE HOUSE", "LET'S TOAST", "FLOUR + SAUCE", "SWEET HOUSE", "SOUP & CO", "THE STUDIO ENTREE", "THE STUDIO TOPPINGS", "THE STUDIO PROTEIN"],
            }
        },
        "IV": {
            kitchens: ["SWEETS AT THE TABLE", "ASIAN KITCHEN", "UNITED KITCHEN", "FUSION GRILL", "SOUP (IV)", "LATIN KITCHEN", "DELICIOUS WITHOUT", "KOSHER DELI", "POMODORO KITCHEN", "SPICE BOWL", "MEZZE TABLE", "SUSHI", "ASIAN KITCHEN TOPPINGS", "GLOBAL BOWLS"],
            availability: {
                "Breakfast": ["SWEETS AT THE TABLE", "ASIAN KITCHEN", "UNITED KITCHEN", "FUSION GRILL", "SOUP (IV)"],
                "Lunch": ["LATIN KITCHEN", "DELICIOUS WITHOUT", "KOSHER DELI", "POMODORO KITCHEN", "SPICE BOWL", "SWEETS AT THE TABLE", "MEZZE TABLE", "SUSHI", "ASIAN KITCHEN", "ASIAN KITCHEN TOPPINGS", "UNITED KITCHEN", "FUSION GRILL", "GLOBAL BOWLS", "SOUP (IV)"],
                "Dinner": ["LATIN KITCHEN", "DELICIOUS WITHOUT", "KOSHER DELI", "POMODORO KITCHEN", "SPICE BOWL", "SWEETS AT THE TABLE", "MEZZE TABLE", "SUSHI", "ASIAN KITCHEN", "ASIAN KITCHEN TOPPINGS", "UNITED KITCHEN", "FUSION GRILL", "GLOBAL BOWLS", "SOUP (IV)"],
            }
        },
    };

    // Dynamically filter kitchens based on selected locations and periods (set to prevent duplicate kitchens)
    const availableKitchens = Array.from(new Set(locations.flatMap((location) => {
        const kitchens = locationToKitchens[location]?.kitchens || [];
        const availablePeriods = periods.length > 0 ? periods : Object.keys(locationToKitchens[location].availability);
        return kitchens.filter(kitchen => 
            availablePeriods.some(period => 
                locationToKitchens[location].availability[period].includes(kitchen)
            )
        );
    })));

    // Toggle selection for buttons
    const toggleSelection = (value, state, setState) => {
        if (state.includes(value)) {
            setState(state.filter((item) => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const storedData = localStorage.getItem("userProfile");
        const userProfile = storedData ? JSON.parse(storedData) : null; //parse the local data into JSON
    
        const requestData = {
            user: userProfile,
            periods: periods,
            locations: locations,
            kitchens: kitchens,
        };
    
        try {
            const editMealsUrl = '/edit-meals'; 
            const newTab = window.open(editMealsUrl, '_blank');
    
            if (newTab) {
                const intervalId = setInterval(() => {
                    if (newTab.document.readyState === 'complete') {
                        clearInterval(intervalId); // Stop checking after the page is fully loaded
                        console.log("New tab loaded, sending message...");
                        newTab.postMessage(requestData, '*');
                    }
                }, 100); 
            } else {
                console.error("Failed to open new tab");
            }
        } catch (error) {
            console.error("Error opening new tab:", error);
        }
    };
    
    

    const isChecked = (item, listofItems) => listofItems.includes(item);

    return (
        <form onSubmit={handleSubmit} className="mealPref-form">
            <section className="operation-hours">
                <h2>Today's Hours of Operation</h2>
                <p>Current Date and Time: {currentDateTime}</p>
            </section>
            <section className="user-mealPref">
                <section className="periods-and-locations">
                    <h3>1. Select Preferences</h3>
                    <section className="selection-row-pl">
                        {/* Periods */}
                        <section className="periods-selection">
                            <label>Meals:</label>
                            {["Breakfast", "Lunch", "Dinner"].map((period) => (
                                <button
                                    type="button"
                                    key={period}
                                    onClick={() => {
                                        toggleSelection(period, periods, setPeriods)
                                        setKitchens([]);
                                    }}
                                    className = {periods.includes(period) ? "button-chosen" : "button-not-chosen"}
                                >
                                    {isChecked(period, periods) ? <IoCheckmarkCircle className= "checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className= "checkmark-alignment" />}
                                    {period}
                                </button>
                            ))}
                        </section>
                        <section className="locations-selection">
                        <label>Locations:</label>
                        {["Stetson_East", "Stetson_West", "IV"].map((location) => (
                                <button
                                    type="button"
                                    key={location}
                                    onClick={() => {
                                        toggleSelection(location, locations, setLocations);
                                        setKitchens([]); // Reset kitchens when locations change
                                    }}
                                    className = {locations.includes(location) ? "button-chosen" : "button-not-chosen"}
                                >
                                    {isChecked(location, locations) ?  <IoCheckmarkCircle className= "checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className= "checkmark-alignment" />}
                                    {location == "IV" ? "International Village" : location.replace("_", " ") }
                                </button>
                        ))}
                        </section>
                    </section>
                    
                </section>
                <section className="kitchens">
                    <div>
                        <h3>2. Select Kitchens</h3>
                        {locations.length === 0 || periods.length === 0 ? (
                            <p>Please select meal periods and locations first.</p>
                        ) : (
                            <div>
                                {locations.map((location) => (
                                    <div key={location}>
                                        <h4>{location == "IV" ? "International Village" : location.replace("_", " ") }:</h4>
                                        {location === "Stetson_West" && periods.length === 1 && periods[0] === "Breakfast" ? (
                                            <p>No kitchen is available at the time you chose.</p>
                                        ) : availableKitchens.length > 0 ? (
                                            availableKitchens.map((kitchen, index) => {
                                                if (locationToKitchens[location].kitchens.includes(kitchen)) {
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={index}
                                                            onClick={() => toggleSelection(kitchen, kitchens, setKitchens)}
                                                            className = {kitchens.includes(kitchen) ? "button-chosen" : "button-not-chosen"}
                                                        >
                                                            {isChecked(kitchen, kitchens) ?  <IoCheckmarkCircle className= "checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className= "checkmark-alignment" />}
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
                        )}
                    </div>
                    <button className = "submit-mealRequest" type="submit">Save and Continue</button>
                </section>
            </section>

            
        </form>
    );
};

export default MealPreferencesForm;