import React, { useState, useEffect } from "react";
import { useSignup } from '../context/SignupContext.jsx'; // Assuming you have a context for managing signup data
import { useNavigate } from 'react-router-dom';
import "../styles/dietaryform.css"; 
import { IoCheckmarkCircle, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { LuCirclePlus } from "react-icons/lu";
import { MdNoFood } from "react-icons/md";
import axios from "axios";

const DietaryRestrictionsForm = () => {
    const { setSignupData, signupData } = useSignup();
    const [allergies, setAllergies] = useState([]);
    const [proteinPreferences, setProteinPreferences] = useState([]);
    const [lifestylePreferences, setLifestylePreferences] = useState([]);
    const [restrictedIngredients, setRestrictedIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState("");
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        setAllergies(signupData.dietaryRestrictions?.allergies || []);
        setProteinPreferences(signupData.dietaryRestrictions?.proteinPreferences || []);
        setLifestylePreferences(signupData.dietaryRestrictions?.lifestylePreferences || []);
        setRestrictedIngredients(signupData.dietaryRestrictions?.restrictedIngredients || []);
    }, [signupData]);

    useEffect(() => {
        const storedData = localStorage.getItem('userProfile');
        if (storedData) {
            setUserProfile(JSON.parse(storedData));
        }
    }, []);

    const handleCheckboxChange = (setState, value) => () => {
        setState((prev) => 
            prev.includes(value) 
                ? prev.filter((item) => item !== value) 
                : [...prev, value] 
        ); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dietaryRestrictions = {
            allergies,
            proteinPreferences,
            lifestylePreferences,
            restrictedIngredients,
        };

        console.log("Submitting dietary restrictions:", dietaryRestrictions);

        try {
            const response = await axios.put(
                `http://localhost:8080/api/users/updateDietaryRestrictions/${userProfile.email}`,
                dietaryRestrictions
            );

            if (response.data) {
                localStorage.setItem('userProfile', JSON.stringify(response.data));
                setSignupData((prevData) => ({
                    ...prevData,
                    ...response.data
                }));
                navigate('/nutritional-goals');
            }
        } catch (error) {
            console.error("Error updating dietary restrictions:", error);
        }
    };

    const isSelected = (item, selectedItems) => selectedItems.includes(item);

    const addIngredient = () => {
        if (newIngredient.trim() !== "") {
            setRestrictedIngredients((prev) => [...prev, newIngredient.trim()]);
            setNewIngredient("");
        } else {
            console.log("No ingredient entered.");
        }
    };

    const removeIngredient = (ingredient) => {
        setRestrictedIngredients((prev) => prev.filter((item) => item !== ingredient));
    };

    
    return (
        <form onSubmit={handleSubmit} className="dietary-restriction-form">
            <h2>Hi there, {signupData.name}! Let's continue setting you up!</h2>
            <p> You might have some <strong>dietary restrictions</strong>, please let me know by filling this out!</p>
            <p>(*You can always edit this later in your profile)</p>

            <h3 className="category">Allergies:</h3>
            <hr />
            {["Gluten", "Soy", "Dairy", "Egg", "Peanuts", "Tree Nuts", "Sesame", "Mustard", "Celery", "Sulphites", "MSG", "Onion", "Garlic", "Seafood/Fish"].map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={handleCheckboxChange(setAllergies, item)}
                    className={isSelected(item, allergies) ? 'button-selected' : 'button-non-selected'}
                >
                    {isSelected(item, allergies) ? <IoCheckmarkCircle className= "checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className= "checkmark-alignment" />}
                    {item}
                </button>
            ))}

            <h3>Proteins:</h3>
            <hr />
            {["Avoid Beef", "Avoid Pork", "Avoid Poultry", "Avoid Alcohol"].map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={handleCheckboxChange(setProteinPreferences, item)}
                    className={isSelected(item, proteinPreferences) ? 'button-selected' : 'button-non-selected'}
                >
                    {isSelected(item, proteinPreferences) ? <IoCheckmarkCircle className= "checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className= "checkmark-alignment" />}
                    {item}
                </button>
            ))}

            <h3>Lifestyle Preferences:</h3>
            <hr />
            {["Vegetarian", "Vegan"].map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={handleCheckboxChange(setLifestylePreferences, item)}
                    className={isSelected(item, lifestylePreferences) ? 'button-selected' : 'button-non-selected'}
                >
                    {isSelected(item, lifestylePreferences) ? <IoCheckmarkCircle className="checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className = "checkmark-alignment" />}
                    {item}
                </button>
            ))}

            <h3>Other Restrictions?</h3>
            <hr />
            <p className= "ingredients-instruction">Write the unwanted ingredient's name just as displayed in Northeastern's Dining Menu!</p>
            <div className="ingredient-container">
                <section className = "ingredient-added">
                    {restrictedIngredients.map((ingredient, index) => (
                        <div key={index} className="ingredient-bubble">
                            <button 
                                type="button" 
                                className="remove-ingredient-signup" 
                                onClick={() => removeIngredient(ingredient)}
                            >
                            {ingredient}
                            </button>
                        </div>
                    ))}
                </section>
                <section className= "input-section-signup">
                    <MdNoFood className= "icon" />
                    <input 
                        type="text" 
                        value={newIngredient} 
                        onChange={(e) => setNewIngredient(e.target.value)} 
                        placeholder="Ingredient" 
                        className="ingredient-input-signup"
                    />
                    <LuCirclePlus className = "add-icon" onClick={addIngredient}/>
                </section>
              
            </div>      

            <button type="submit" className = "next-button-part2">Save and continue!</button>
        </form>
    );
};

export default DietaryRestrictionsForm;
