import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLoginForm from './components/UserLoginForm.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import DietaryRestrictions from './components/DietaryRestrictionsForm.jsx';
import NutritionalGoals from './components/NutritionalPreferencesForm.jsx';
import HomePage from './components/HomePage.jsx';
import { SignupProvider } from './context/SignupContext';
import MealPreferencesForm from './components/MealPreferencesForm.jsx';
import EditMeals from './components/EditMeals.jsx';

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
                    <Route path="/meal-preferences" element={<MealPreferencesForm />} />
                    <Route path="/edit-meals" element={<EditMeals />} />
                </Routes>
            </Router>
        </SignupProvider>
    );
};

export default App;
