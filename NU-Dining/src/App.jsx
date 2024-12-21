import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLoginForm from './components/UserLoginForm.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import DietaryRestrictions from './components/DietaryRestrictionsForm.jsx';
import NutritionalGoals from './components/NutritionalPreferencesForm.jsx';
import HomePage from './components/HomePage.jsx';
import { SignupProvider } from './context/SignupContext';

const App = () => {
    return (
        <SignupProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<UserLoginForm />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/dietary-restrictions" element={<DietaryRestrictions />} />
                    <Route path="/nutritional-goals" element={<NutritionalGoals />} />
                    <Route path="/home" element={<HomePage />} />
                </Routes>
            </Router>
        </SignupProvider>
    );
};

export default App;
