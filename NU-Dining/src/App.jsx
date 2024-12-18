import React, { useState } from "react";
import axios from "axios";
import UserLoginForm from "./components/UserLoginForm";
import DietaryRestrictionsForm from "./components/DietaryRestrictionsForm";
import NutritionalPreferencesForm from "./components/NutritionalPreferencesForm";
import MealPreferencesForm from "./components/MealPreferencesForm";

const App = () => {
    const [step, setStep] = useState(1);
    const [isNewUser, setIsNewUser] = useState(false);
    const [userData, setUserData] = useState({});
    const [meals, setMeals] = useState([]);

    const fetchUserData = (email) => {
        axios
            .get(`http://localhost:8080/api/users/getUserByEmail/${email}`)
            .then((response) => {
                setUserData(response.data);
                setStep(4);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    };

    const handleUserSubmit = (data) => {
        setIsNewUser(data.isNewUser);
        setUserData((prev) => ({ ...prev, ...data }));

        if (data.isNewUser) {
            setStep(2);
        } else {
            fetchUserData(data.email);
        }
    };

    const handleDietarySubmit = (data) => {
        setUserData((prev) => ({ ...prev, dietaryRestrictions: data }));
        setStep(3);
    };

    const handleNutritionSubmit = (data) => {
        setUserData((prev) => ({ ...prev, nutritionalFocus: data }));

        if (isNewUser) {
            axios
                .post("http://localhost:8080/api/users/addUser", userData)
                .then(() => {
                    console.log("User data submitted successfully!");
                    setStep(4);
                })
                .catch((error) => {
                    console.error("Error submitting user data:", error);
                });
        } else {
            setStep(4);
        }
    };

    const handleMealPreferencesSubmit = (preferences) => {
        const requestData = {
            user: userData,
            locations: preferences.locations,
            periods: preferences.periods,
            kitchens: preferences.kitchens,
        };

        console.log("Sending to generatePotentialMeals:", requestData);

        axios
            .post("http://localhost:8080/api/meals/generatePotentialMeals", requestData, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("Generated Meals:", response.data);
                setMeals(response.data);
                setStep(5);
            })
            .catch((error) => {
                console.error("Error generating meals:", error);
            });
    };

    // Function to group meals by period
    const groupMealsByPeriod = (meals) => {
        return meals.reduce((acc, meal) => {
            const period = meal.period; // Assuming meal has a 'period' property
            if (!acc[period]) {
                acc[period] = [];
            }
            acc[period].push(meal);
            return acc;
        }, {});
    };

    // Group meals for display
    const groupedMeals = groupMealsByPeriod(meals);

    // Function to handle going back a step
    const handleBack = () => {
        setStep((prevStep) => Math.max(prevStep - 1, 1)); // Prevent going below step 1
    };

    return (
        <div>
            {step === 1 && <UserLoginForm onSubmit={handleUserSubmit} />}
            {step === 2 && isNewUser && <DietaryRestrictionsForm onSubmit={handleDietarySubmit} />}
            {step === 3 && isNewUser && <NutritionalPreferencesForm onSubmit={handleNutritionSubmit} />}
            {step === 4 && <MealPreferencesForm onSubmit={handleMealPreferencesSubmit} />}
            {step === 5 && (
                <div>
                    <h2>Generated Meals</h2>
                    {Object.keys(groupedMeals).map((period) => (
                        <div key={period}>
                            <h3>{period}</h3>
                            <ul>
                                {groupedMeals[period].map((meal, index) => (
                                    <li key={index}>
                                        {meal.location} - {meal.kitchen} - {meal.dishName} 
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
            {step > 1 && (
                <button onClick={handleBack} style={{ marginTop: "20px" }}>
                    Back
                </button>
            )}
        </div>
    );
};

export default App;
