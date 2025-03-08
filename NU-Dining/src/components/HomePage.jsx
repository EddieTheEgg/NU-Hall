import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { MdNoFood } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";
import { LuCirclePlus } from "react-icons/lu";
import { IoCheckmarkCircle, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { saveToLocalStorage } from "../utils/localStorageUtils"; 

import "../styles/homePage.css"; 
import defaultAvatar from "../assets/default_avatar.jpg";

const HomePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('Home'); 
    const [userNutritionFocus, setUserNutritionFocus] = useState({});
    const [userDietaryRestrictions, setUserDietaryRestrictions] = useState({});
    const [allergies, setAllergies] = useState([]);
    const [proteinPreferences, setProteinPreferences] = useState([]);
    const [lifestylePreferences, setLifestylePreferences] = useState([]);
    const [restrictedIngredients, setRestrictedIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [reloadData, setReloadData] = useState(false);
    const [newIngredient, setNewIngredient] = useState("");
    const [editableName, setEditableName] = useState(userProfile?.name);
    const [editableEmail, setEditableEmail] = useState(userProfile?.email);
    const [editablePassword, setEditablePassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEmail, setIsModalOpenEmail] = useState(false);
    const [isVerifyPassword, setIsVerifyPassword] = useState(false);
    const [newEmail, setNewEmail] = useState(userProfile?.email);
    const [newName, setNewName] = useState(userProfile?.name);
    const [verifiedPasswordMessage, setVerifiedPasswordMessage] = useState("");
    const [potentialVerifyPassword, setPotentialVerifyPassword] = useState("");

    const navigate = useNavigate();

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

    useEffect(() => {
        const storedData = localStorage.getItem('userProfile');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log(parsedData);
            setUserProfile(parsedData);

    
            if (typeof parsedData.nutritionalFocus === 'object' && parsedData.nutritionalFocus !== null) {
                setUserNutritionFocus(parsedData.nutritionalFocus);
            } else {
                setUserNutritionFocus({});
            }

            if (typeof parsedData.dietaryRestrictions === 'object' && parsedData.dietaryRestrictions !== null) {
                setUserDietaryRestrictions(parsedData.dietaryRestrictions);
                setAllergies(parsedData.dietaryRestrictions.allergies);
                setProteinPreferences(parsedData.dietaryRestrictions.proteinPreferences);
                setLifestylePreferences(parsedData.dietaryRestrictions.lifestylePreferences);
                setRestrictedIngredients(parsedData.dietaryRestrictions.restrictedIngredients);
            } else{
                setUserDietaryRestrictions({
                    allergies: [], 
                    proteinPreferences: [],
                    lifestylePreferences: [],
                    restrictedIngredients: []}); 
            }
            console.log(parsedData);
        }
    }, [reloadData]);
    
    
    const handleGoalChange = (nutrient, type, value) => {
        setUserNutritionFocus((prevFocus) => ({
            ...prevFocus,
            [nutrient]: {
                ...prevFocus[nutrient],
                [type]: value, // Update either 'min' or 'max'
            },
        }));
    };

    const selectedNutrientType = (nutrient) => {
        return nutrient in userNutritionFocus;
    };

    const handleNutrientFocus = (nutrient) => {
        setUserNutritionFocus((prevFocus) => {
            const updatedFocus = { ...prevFocus };
    
            if (updatedFocus[nutrient]) {
                delete updatedFocus[nutrient];
            } else {
                updatedFocus[nutrient] = { min: 0, max: 0 };
            }
            return updatedFocus;
        });
    };

    
    const handleMakeMealClick = () => {
        navigate('/meal-preferences');
    };

    //This is specifically for the dietary restricton form of the homepage

    const handleCheckboxChange = (setState, value) => () => {
        setState((prev) => 
            prev.includes(value) 
                ? prev.filter((item) => item !== value) 
                : [...prev, value] 
        ); 
    };

    const userSelectedRestriction = (item, selectedItems) => selectedItems.includes(item);

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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const encodedEmail = encodeURIComponent(userProfile.email);
            const response = await fetch(`http://localhost:8080/api/users/updateNutritionFocus/${encodedEmail}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userNutritionFocus),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Data successfully saved:', data);
                
                const { name, email, dietaryRestrictions, nutritionalFocus } = data;
                saveToLocalStorage("userProfile", { name, email, dietaryRestrictions, nutritionalFocus });
    
                setReloadData((prev) => !prev); 
            } else {
                console.error('Error saving data:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitDietary = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const newDietaryRestrictions = {
            allergies,
            proteinPreferences,
            lifestylePreferences,
            restrictedIngredients,
        };

        console.log("New Dietary Restrictions: ", newDietaryRestrictions);
    
        try {
            const encodedEmail = encodeURIComponent(userProfile.email);
            const response = await fetch(`http://localhost:8080/api/users/updateDietaryRestrictions/${encodedEmail}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDietaryRestrictions),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Data successfully saved:', data);
                
                const { name, email, dietaryRestrictions, nutritionalFocus } = data;
                saveToLocalStorage("userProfile", { name, email, dietaryRestrictions, nutritionalFocus });
    
                setReloadData((prev) => !prev); 
            } else {
                console.error('Error saving data:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    
    
    

    const handleSavePersonalInfo = async () => {
        const updatedUserProfile = {
            ...userProfile,
            name: editableName,
            email: editableEmail,
            password: editablePassword,
        };
        
        try {
            const response = await fetch(`http://localhost:8080/api/users/update/${userProfile.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserProfile),
            });
    
            if (response.ok) {
                const data = await response.json();
                saveToLocalStorage("userProfile", data);
                setUserProfile(data);
                console.log('User information updated successfully');
            } else {
                console.error('Error updating user information:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChangeNameClick = () => {
        setNewName(userProfile.name);
        setIsModalOpen(true);
    };

    const handleChangeEmailClick = () => {
        setNewEmail(userProfile.email);
        setIsVerifyPassword(true);
    };

    const handleVerifyPasswordCheck = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/verify/${userProfile.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(potentialVerifyPassword)
            });
            if (response.ok) {
                const isVerified = await response.json();
                if (isVerified) {
                    setIsVerifyPassword(false);
                    setIsModalOpenEmail(true);
                    setPotentialVerifyPassword("");
                    setVerifiedPasswordMessage("")
                } else {
                    setVerifiedPasswordMessage("*Incorrect password. Please try again.");
                }
            } else {
                console.error("Server error: ", response.statusText);
            }
        } catch (error) {
            console.error("Error verifying password: ", error);
        }
    };
    

    const handleModalSave = async () => {
        const updatedUserProfile = { ...userProfile, name: newName };
        
        try {
            const response = await fetch(`http://localhost:8080/api/users/update/${userProfile.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserProfile),
            });

            if (response.ok) {
                const data = await response.json();
                saveToLocalStorage("userProfile", data);
                setUserProfile(data);
                console.log('User information updated successfully');
            } else {
                console.error('Error updating user information:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
        setIsModalOpen(false);
    };

    const handleModalSaveEmail = async () => {
        const updatedUserProfile = {
            ...userProfile,
            email: newEmail,
        }

        try {
            const response = await fetch(`http://localhost:8080/api/users/update/${userProfile.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserProfile),
            });

            if (response.ok) {
                const data = await response.json();
                saveToLocalStorage("userProfile", data);
                setUserProfile(data);
                console.log('User information updated successfully');
            } else {
                console.error('Error updating user information:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
        setIsModalOpenEmail(false);
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Home':
                return (
                    <div>
                        {userProfile && userProfile.name ? (
                            <h2>Hello {userProfile.name}!</h2>
                        ) : (
                            <h2>Welcome!</h2>
                        )}
                        <p>When you are ready to make your meals, click below to begin!</p>
                        <p>Have any new updates to your dietary restrictions or nutritional goals? Update them in the sidebar to the left!</p>
                        <button onClick={handleMakeMealClick}>Create!</button>
                    </div>
                );
                case 'Nutrition':
                    {console.log('userNutritionFocus:', userNutritionFocus)}
                    return (
                        <div>
                            <h2>Your Nutritional Goals</h2>
                            <p>Edit your nutritional goals here and remember to save!</p>
                            <form onSubmit={handleSubmit} className="nutritionalEdit-form">
                                <hr />
                                {nutrients.map((nutrient) => (
                                    <div key={nutrient} className="nutrient">
                                            <div className="nutrient-focused">
                                                <button
                                                    type="button"
                                                    className={selectedNutrientType(nutrient) ? 'nutrient-button-active' : 'nutrient-button-nonactive'}
                                                    onClick={() => handleNutrientFocus(nutrient)}
                                                    >
                                                    {nutrient}
                                                </button>
                
                                                <div className= {userNutritionFocus[nutrient] ? "range-inputs visible" : "range-inputs"}>
                                                    <div className="range-pointer">▶</div>
                                                    <section className="edit-range-section">
                                                        <label>Min:</label>
                                                        <input
                                                            type="number"
                                                            placeholder={userNutritionFocus[nutrient]?.min ?? "0"}
                                                            value={userNutritionFocus[nutrient]?.min ?? ""}
                                                            onChange={(e) => handleGoalChange(nutrient, "min", e.target.value)}
                                                            
                                                        />
                                                    </section>
                                                    <section className="edit-range-section">
                                                        <label>Max:</label>
                                                        <input
                                                            type="number"
                                                            placeholder={userNutritionFocus[nutrient]?.max ?? "0"}
                                                            value={userNutritionFocus[nutrient]?.max ?? ""}
                                                            onChange={(e) => handleGoalChange(nutrient, "max", e.target.value)}
                                                            
                                                        />
                                                    </section>
                                                </div>
                                            </div>
                                    </div>
                                ))}
                               <button type="submit" className="save-nutritionGoals" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save!'}
                               </button>

                            </form>
                        </div>
                    );               
            case 'Dietary Restriction':
                return (
                    <div>
                        <h2>Dietary Restrictions</h2>
                        <p>Edit your dietary restrictions here and remember to save!</p>
                        <form onSubmit={handleSubmitDietary} className="dietary-restriction-form-v2">

                            <h3 className="category-label">Allergies:</h3>
                            <hr />
                            {["Gluten", "Soy", "Dairy", "Egg", "Peanuts", "Tree Nuts", "Sesame", "Mustard", "Celery", "Sulphites", "MSG", "Onion", "Garlic", "Seafood/Fish"].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={handleCheckboxChange(setAllergies, item)}
                                    className={userSelectedRestriction(item, allergies) ? 'button-selected-v2' : 'button-non-selected-v2'}
                                >
                                    {userSelectedRestriction(item, allergies) ? <IoCheckmarkCircle className= "checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className= "checkmark-alignment" />}
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
                                    className={userSelectedRestriction(item, proteinPreferences) ? 'button-selected-v2' : 'button-non-selected-v2'}
                                >
                                    {userSelectedRestriction(item, proteinPreferences) ? <IoCheckmarkCircle className= "checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className= "checkmark-alignment" />}
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
                                    className={userSelectedRestriction(item, lifestylePreferences) ? 'button-selected-v2' : 'button-non-selected-v2'}
                                >
                                    {userSelectedRestriction(item, lifestylePreferences) ? <IoCheckmarkCircle className="checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className = "checkmark-alignment" />}
                                    {item}
                                </button>
                            ))}

                            <h3>Other Restrictions?</h3>
                            <hr />
                            <p className= "ingredients-instruction">Write the unwanted ingredient&apos;s name just as displayed in Northeastern&apos;s Dining Menu!</p>
                            <div className="ingredient-container">
                                <section className = "ingredient-added">
                                    {restrictedIngredients.map((ingredient, index) => (
                                        <div key={index} className="ingredient-bubble">
                                            <button 
                                                type="button" 
                                                className="remove-ingredient" 
                                                onClick={() => removeIngredient(ingredient)}
                                            >
                                            {ingredient}
                                            </button>
                                        </div>
                                    ))}
                                </section>
                                <section className= "input-section">
                                    <MdNoFood className= "icon" />
                                    <input 
                                        type="text" 
                                        value={newIngredient} 
                                        onChange={(e) => setNewIngredient(e.target.value)} 
                                        placeholder="Ingredient" 
                                        className="ingredient-input"
                                    />
                                    <LuCirclePlus className = "add-icon" onClick={addIngredient}/>
                                </section>
                            
                                <button type="submit" className = "next-button-part2-v2">Save!</button>
                            </div>      

                            
                        </form>
                    </div>
                );
            case 'Personal':
                return (
                    <>
                        <div>
                            <h2>Personal Information</h2>
                            <p>Update your personal information here! Remember to save!</p>
                            <hr />
                        </div>
                        <section className = "personal-info-edit">
                            <section className="personal-edit-name">
                            <section className="display-userName">
                                 <h3>Name: </h3>
                                <div>
                                    {userProfile.name}
                                </div>
                            </section>
                                <button className="edit-userName" onClick={handleChangeNameClick}>Change Name</button>
                            </section>
                            <section className="personal-edit-email">
                                <section className="display-personal-email">
                                    <h3>Email: </h3>
                                    <div>
                                        {userProfile.email}
                                    </div>
                                </section>
                                <button className="edit-email" onClick={handleChangeEmailClick}>Change Email</button>
                            </section>
                            <section className="personal-edit-input">
                                <h3>Password: </h3>
                                <div>
                                    *********
                                </div>
                            </section>
                        </section>
                       
                        <button onClick={handleSavePersonalInfo} className="save-personal-info-button">Save!</button>
                    </>
                );
            default:
                return <div><h2>Welcome!</h2></div>;
        }
    };

    return (
        <>  
        <section className="homepage-container">
            <section className="sidebar">
                <div className="user-profile-image">
                    <img src={defaultAvatar} alt="Default Avatar" />
                </div>
                <ul className="tabs">
                    <li 
                        onClick={() => setActiveTab('Home')} 
                        className={activeTab === 'Home' ? 'active-tab' : ''}
                    >
                        <FaHome />
                        <div>Home</div>
                    </li>
                    <li 
                        onClick={() => setActiveTab('Personal')} 
                        className={activeTab === 'Personal' ? 'active-tab' : ''}
                    >
                        <IoMdPerson />
                        <div>Personal</div>
                    </li>
                    <li 
                        onClick={() => setActiveTab('Nutrition')} 
                        className={activeTab === 'Nutrition' ? 'active-tab' : ''}
                    >
                        <GoGoal />
                        <div>Nutritional Goals</div>
                    </li>
                    <li 
                        onClick={() => setActiveTab('Dietary Restriction')} 
                        className={activeTab === 'Dietary Restriction' ? 'active-tab' : ''}
                    >
                        <MdNoFood />
                        <div>Dietary Restrictions</div>
                    </li>
                   
                </ul>
            </section>
            <section className="main-content">
                {renderContent()}
            </section>
        </section>
        {isModalOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                <section className="modal-topbar-username">
                    <h3>Change Name</h3>
                    <button className="close-modal" onClick={() => setIsModalOpen(false)}>✖</button>
                </section>
                <section className="modal-bottombar-username">
                    <div>Please enter your new name </div>
                    <input 
                        className="edit-nameInput"
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        placeholder= {userProfile.name} 
                        />
                    <button className= "save-newUsername"onClick={handleModalSave}>Save</button>
                </section>
                   
                </div>
            </div>
        )}
        {isVerifyPassword && (
            <div className = "passwordVerify-overlay">
                <div className="passwordVerify-content">
                    <section className="passwordVerify-topbar">
                        <h3>Enter Password</h3>
                        <button 
                        className="close-verifyPassword" 
                        onClick={() => 
                        {setIsVerifyPassword(false); 
                        setPotentialVerifyPassword("");}}>
                        ✖</button>
                    </section>
                    <section className = "passwordVerify-bottombar">
                        <div>To change email/password, please enter your current password</div>
                        <div className="passwordVerify-message">{verifiedPasswordMessage}</div>
                        <input
                            className = "passwordVerify-input"
                            type = "password"
                            value = {potentialVerifyPassword}
                            onChange = {(e) => setPotentialVerifyPassword(e.target.value)}
                            placeholder = "*******"
                         />
                         <button className = "verifyPasswordCorrect" onClick={handleVerifyPasswordCheck}>Enter</button>
                    </section>
                </div>

            </div>
        )}
        {isModalOpenEmail && (
            <div className="modal-overlay">
                <div className="modal-content">
                <section className="modal-topbar-username">
                    <h3>Change Email</h3>
                    <button className="close-modal" onClick={() => setIsModalOpenEmail(false)}>✖</button>
                </section>
                <section className="modal-bottombar-username">
                    <div>Please enter your new email </div>
                    <input 
                        className="edit-nameInput"
                        type="text" 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)} 
                        placeholder= {userProfile.email} 
                        />
                    <button className= "save-newEmail"onClick={handleModalSaveEmail}>Save</button>
                </section>
                   
                </div>
            </div>
        )}
        </>
    );
};

export default HomePage;
