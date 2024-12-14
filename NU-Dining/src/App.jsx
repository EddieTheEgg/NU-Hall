import React, { useState } from "react";
import axios from 'axios';
import UserLoginForm from "./components/UserLoginForm";
import DietaryRestrictionsForm from "./components/DietaryRestrictionsForm";
import NutritionalPreferencesForm from "./components/NutritionalPreferencesForm";

const App = () => {
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({});

    const handleUserSubmit = (data) => {
        setUserData((prev) => ({ ...prev, ...data }));
        setStep(2);
    };

    const handleDietarySubmit = (data) => {
        setUserData((prev) => ({ ...prev, dietaryRestrictions: data }));
        setStep(3);
    };

    const handleNutritionSubmit = (data) => { 
        // Merge user data and send the request
        const finalData = { ...userData, nutritionalPreferences: data };
        console.log("Final User Data:", finalData); // Log the data being sent to the backend
    
        axios.post('http://localhost:8080/api/users/addUser', finalData, {
            headers: {
                'Content-Type': 'application/json',  // Ensure that the backend knows we're sending JSON
            },
        })
        .then((response) => {
            console.log('Success:', response.data);  // Handle successful response
        })
        .catch((error) => {
            console.error('Error:', error);  // Handle any errors
        });
    };
    

    return (
        <div>
            {step === 1 && <UserLoginForm onSubmit={handleUserSubmit} />}
            {step === 2 && <DietaryRestrictionsForm onSubmit={handleDietarySubmit} />}
            {step === 3 && <NutritionalPreferencesForm onSubmit={handleNutritionSubmit} />}
        </div>
    );
};

export default App;
