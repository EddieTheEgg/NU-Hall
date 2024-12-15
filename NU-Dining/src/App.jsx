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
 
        console.log('Nutritional Preferences to send:', data);
        
        const finalData = { ...userData, nutritionalFocus: data }; 
    
        axios.post('http://localhost:8080/api/users/addUser', finalData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            console.log('Success:', response.data);
            setUserData({});
            setStep(1);
        })
        .catch((error) => {
            console.error('Error:', error);
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
