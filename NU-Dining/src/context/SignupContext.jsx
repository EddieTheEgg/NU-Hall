import React, { createContext, useContext, useState } from 'react';

// Create a context for signup data
const SignupContext = createContext();

// Provider component
export const SignupProvider = ({ children }) => {
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        dietaryRestrictions: {},
        nutritionalPreferences: {},
    });

    return (
        <SignupContext.Provider value={{ signupData, setSignupData }}>
            {children}
        </SignupContext.Provider>
    );
};

// Custom hook to use the SignupContext
export const useSignup = () => {
    return useContext(SignupContext);
}; 