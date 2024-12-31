import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/editMeals.css";
import { IoIosAddCircle } from "react-icons/io";
import { IoIosInformationCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { IoCheckmarkCircle, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom'; 

const EditMeals = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [locationPeriods, setLocationPeriods] = useState({});
  const [currentSelection, setCurrentSelection] = useState(null); 
  const [currentMealNutrient, setCurrentMealNutrient] = useState(null);
  const [userNutritionalFocus, setUserNutritionalFocus] = useState([
    { display: "Calories", backend: "calories", range: {max: 0, min: 0}},
     {display: "Total Carbohydrates (g)", backend: "carbohydrates", range: {max: 0, min: 0}}, 
     {display: "Protein (g)", backend: "protein", range: {max: 0, min: 0}}, 
     {display: "Total Fat (g)" , backend: "fat", range: {max: 0, min: 0}}]);
  const [selectedLocationPeriods, setSelectedLocationPeriods] = useState({});
  const [nutrientSummary, setNutrientSummary] = useState([]);
  const [editableGoals, setEditableGoals] = useState(userNutritionalFocus);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nutrientKeys = [
    {"Calories": "calories"},
    {"Protein (g)": "protein"},
    {"Total Carbohydrates (g)": "carbohydrates"},
    {"Sugar (g)": "sugar"},
    {"Total Fat (g)": "fat"},
    {"Saturated Fat (g)": "saturatedFat"},
    {"Cholesterol (mg)": "cholesterol"},
    {"Dietary Fiber (g)": "dietaryFiber"},
    {"Sodium (mg)": "sodium"},
    {"Potassium (mg)": "potassium"},
    {"Calcium (mg)": "calcium"},
    {"Iron (mg)": "iron"},
    {"Trans Fat (g)": "transFat"},
    {"Vitamin D (IU)": "vitaminD"},
    {"Vitamin C (mg)": "vitaminC"},
    {"Calories From Fat": "caloriesFromFat"},
    {"Vitamin A (RE)": "vitaminA"},
    {"Saturated Fat + Trans Fat (g)": "saturatedTransFat"},
  ];
  
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin === window.location.origin) {
        const requestData = event.data;
        console.log("Received message:", requestData);

        if (requestData) {
          setLoading(true);

          if (requestData.user.nutritionalFocus){
            const userNutrientFocus = Object.entries(requestData.user.nutritionalFocus).map(([key, value]) => {
              //key being frontend user display nutrient version
              const matchedNutrient = nutrientKeys.find(nutrient => nutrient[key]);
              console.log(Object.entries(matchedNutrient)[0][1]); //ex: [["protein(g) : protein "]]
            
              return {
                display: key,  
                backend: Object.entries(matchedNutrient)[0][1],  
                range: value, 
              };
            });
            console.log("User Nutrient Focus:", userNutrientFocus);
            setUserNutritionalFocus(userNutrientFocus);
          }
     

          try {
            const response = await axios.post(
              "http://localhost:8080/api/meals/generatePotentialMeals",
              requestData
            );

            console.log("Response data:", response.data);

            if (Array.isArray(response.data)) {
              setMeals(response.data); 

              const periodsFromMeals = response.data.map((meal) => meal.period);
              
              const customOrder = ["Breakfast", "Lunch", "Dinner"];
              const sortedPeriods = [...new Set(periodsFromMeals)].sort((a, b) => {
                  return customOrder.indexOf(a) - customOrder.indexOf(b); //if negative, a comes before b, positive, b comes before a
              });

              setPeriods(sortedPeriods);

              const periodLocationDict = response.data.reduce((acc, meal) => {
                const { period, location } = meal;
                if (!acc[period]) {
                  acc[period] = new Set();
                }
                acc[period].add(location);
                return acc;
              }, {});

              // Convert Sets to arrays for easier rendering
              const formattedDict = Object.keys(periodLocationDict).reduce((acc, key) => {
                acc[key] = Array.from(periodLocationDict[key]);
                return acc;
              }, {});

              setLocationPeriods(formattedDict);
              console.log(formattedDict);

            } else {
              setError("Data is not in the expected format.");
            }
          } catch (err) {
            setError("Failed to fetch meals. Please try again.");
            console.error("Error fetching meals:", err);
          } finally {
            setLoading(false);
          }
        } else {
          console.error("Invalid data received");
        }
      }
    };

    window.addEventListener("message", handleMessage);


    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Main Functions:

  // Get available meals for the current location and period
  const getAvailableMeals = (period, location) => {
    return meals
      .filter((meal) => meal.period === period && meal.location === location)
      .sort((a, b) => { 
        if (a.kitchen < b.kitchen) {
          return -1;
        }
        if (a.kitchen > b.kitchen) {
          return 1;
        }
        return 0;
      });
  };
  

  // Adds a meal
  const addMeal = (meal) => {
    setSelectedMeals((prev) => [...prev, meal]);
    setMeals((prev) => prev.filter((m) => m.id !== meal.id)); 
  };

  // Removes a meal
  const removeMeal = (meal) => {
    setSelectedMeals((prev) => prev.filter((m) => m.id !== meal.id));
    setMeals((prev) => [...prev, meal]); 
  };

  const displayMealNutrient = (meal) => {
    if (currentMealNutrient && currentMealNutrient.dishName === meal.dishName) {
      setCurrentMealNutrient(null);
    } else {
      setCurrentMealNutrient(meal);
    }
  };

  const mealSelectionExist = (period, location) => {
    const existingLocations = selectedLocationPeriods[period] || [];
    return (existingLocations.includes(location))
  }
  


  const updateSelectedLocationPeriods = (period, location) => {
    setSelectedLocationPeriods((prev) => {

      //Necessary to keep the previous state of arrays in check:
      const existingLocations = prev[period] || [];
    
      if (existingLocations.includes(location)) {
        const updatedLocations = existingLocations.filter(loc => loc !== location);
        const newState = {
          ...prev, 
          [period]: updatedLocations, 
        };
        
        return newState;
      } else {
        const newState = {
          ...prev, 
          [period]: [...existingLocations, location], 
        };
        console.log('Updated State after addition:', newState);
        
        return newState;
      }
    });
  };

  const handleGoalChange = (e, nutrient, rangeType) => {
    const { value } = e.target;
    
    // Parse value to a number
    const newValue = isNaN(value) ? "" : parseFloat(value);
  
    setUserNutritionalFocus((prevFocus) => {
      return prevFocus.map((nutrientInfo) => {
        if (nutrientInfo.backend === nutrient.backend) {
          return {
            ...nutrientInfo,
            range: {
              ...nutrientInfo.range,
              [rangeType]: newValue, 
            },
          };
        }
        return nutrientInfo;
      });
    });
  };
  
  
  
  

  useEffect(() => {
    const calculateTotalNutrients = () => {
      const totalNutrients = userNutritionalFocus.reduce((totals, { backend, display }) => { 
        let total = 0;
  
        Object.entries(selectedLocationPeriods).forEach(([period, locations]) => {
          locations.forEach((location) => {
            const mealsForSelection = selectedMeals.filter(
              (meal) => meal.period === period && meal.location === location);

              console.log('Meals for selection:', mealsForSelection); 
            total += mealsForSelection.reduce(
              (sum, meal) => sum + (meal[backend] || 0), 0);
          });
        });
  
        totals[display] = total; 
        return totals;
      }, {});
  
      return totalNutrients;
    };
  
    const totalNutrients = calculateTotalNutrients();
    console.log(totalNutrients); // Debugging
    setNutrientSummary(totalNutrients);
  }, [selectedMeals, selectedLocationPeriods, userNutritionalFocus]);
  
  
  
  
  

  return (
    <>
      <section className="main-container">
        <form className="form-container" onSubmit={(e) => e.preventDefault()}>
          <section className="periods">
            <h2>Meal Creator:</h2>
            {periods.map((period, index) => (
              <div key={index} className="period-section">
                <h3>{period}:</h3>
                <section className="locations-per-period">
                  {locationPeriods[period]?.map((location, locIndex) => (
                    <div key={locIndex} className= {mealSelectionExist(period, location) ? "selected-create-meal-section" : "create-meal-section"}>
                      <section className="create-meal-section-header">
                        <h3>{location.replace("_", " ")}</h3>
                        {mealSelectionExist(period, location) ?  
                        <IoCheckmarkCircle
                        className="complete-meal-button"
                        onClick={() => updateSelectedLocationPeriods(period, location)}                         
                        /> :  <IoCheckmarkCircleOutline
                        className="complete-meal-button"
                        onClick={() => updateSelectedLocationPeriods(period, location)}                         
                        />}
                      
                      </section>
                      <section className="create-meal">
                        <section className="selectedMeals">
                          {selectedMeals
                            .filter(
                              (meal) =>
                                meal.period === period &&
                                meal.location === location
                            )
                            .map((meal) => (
                              <div key={meal.id} className = "meal-added">
                              <section className= "horizontal-mealBar">
                                <div className="select-mealDisplay"><strong>{meal.kitchen}</strong> - {meal.dishName}</div>
                                <div className="specific-mealButtons">
                                  <IoIosInformationCircle className="information-button" onClick={() => displayMealNutrient(meal)}/>
                                  <IoMdCloseCircle onClick={() => removeMeal(meal)} className="remove-specific-meal-button" />
                                </div>
                              </section>                                  
                              {currentMealNutrient &&
                               currentMealNutrient.dishName === meal.dishName &&(
                                <section className="meal-nutrientInfo">                         
                                    <p><strong>Ingredients:</strong> {currentMealNutrient.ingredients}</p>
                                    {userNutritionalFocus.map(({ display, backend }) => {
                                      return (
                                        <p key={backend}>
                                          <strong>{display}:</strong> {currentMealNutrient[backend] || 0}
                                        </p>
                                      );
                                    })}
                              </section>
                              )}
                            </div>
                            ))}
                        </section>
                        <button
                          type="button"
                          className="add-meal-button"
                          onClick={() => {
                            if (
                              currentSelection &&
                              (currentSelection.period !== period || currentSelection.location !== location)
                            ) {
                              setCurrentSelection({ period, location });
                            } else if (!currentSelection) {
                              setCurrentSelection({ period, location });
                            } else {
                              setCurrentSelection(null);
                            }
                          }}
                        >
                          +
                        </button>
                        </section>
                      {/*Displays the avaliable meals for that specific period and location */}
                      {currentSelection &&
                        currentSelection.period === period &&
                        currentSelection.location === location && (
                          <div className="meal-selection-modal">
                            <div className="meal-Selections">
                              <section className = "header-mealSelections">
                                <h3>
                                  Avaliable Meals for {currentSelection.period} at{" "} {currentSelection.location.replace("_", " ")} 
                                </h3>
                                <IoMdCloseCircle onClick={() => setCurrentSelection(null)} className="close-mealSelections"/>
                              </section>                      
                              <div>
                                {getAvailableMeals(
                                  currentSelection.period,
                                  currentSelection.location
                                ).map((meal) => (
                                  <div key={meal.id} className = "potential-meal-add">
                                    <section className= "horizontal-mealBar">
                                      <div className="select-mealDisplay"><strong>{meal.kitchen}</strong> - {meal.dishName}</div>
                                      <div className="specific-mealButtons">
                                        <IoIosInformationCircle className="information-button" onClick={() => displayMealNutrient(meal)}/>
                                        <IoIosAddCircle onClick={() => addMeal(meal)} className="add-specific-meal-button" />
                                      </div>
                                    </section>                                  
                                    {currentMealNutrient &&
                                     currentMealNutrient.dishName === meal.dishName &&(
                                      <section className="meal-nutrientInfo">                         
                                          <p><strong>Ingredients:</strong> {currentMealNutrient.ingredients}</p>
                                          {userNutritionalFocus.map(({ display, backend }) => {
                                            return (
                                              <p key={backend}>
                                                <strong>{display}:</strong> {currentMealNutrient[backend] || 0}
                                              </p>
                                            );
                                          })}
                                    </section>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/*Displays the nutrient info for that specific period and location */}
                        <section className = "periodLocationNutrientInfo-container">
                            <h3>Total Nutrient:</h3>
                            <section className="periodLocation-nutrientInfo">
                            {userNutritionalFocus.map(({ display, backend }) => {
                              const totalNutrient = selectedMeals
                                .filter(
                                  (meal) =>
                                    meal.period === period && meal.location === location
                                )
                                .reduce((total, meal) => total + (meal[backend] || 0), 0); 
                                return (
                                <p key={backend}>
                                  <strong>{display}:</strong> {totalNutrient}                            
                                </p>
                                
                              );
                              
                            })}
                          </section>
                        </section>
                     

                    </div>
                  ))}
                </section>
              </div>
            ))}
            <h2>Nutrient Summary:</h2>
             <section className="user-nutrientSummaries">
              
            <section className="nutrientGoal-display">
              <h3>Nutrient Summary:</h3>
              <p>Select the meal period and location that you want to be added to the total(s)!</p>
              <section className="displayTotal-section">
                {Object.entries(nutrientSummary).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}
                  </p>                 
                ))}
              </section>
             
            </section>
            <section className="userNutritional-Goals">
              <h3>Nutrient Goals:</h3>
              <p>These numbers are editable, but if you want to configure your saved nutritional goals, go to settings!</p>
               <section className="displayGoalRange-section">
                  {userNutritionalFocus.map((nutrientInfo) => {
                    return (
                      <div key={nutrientInfo.backend}>
                        <strong>{nutrientInfo.display} Range: </strong>
                        <input
                          type="number"
                          placeholder={nutrientInfo.range.min || "0"}
                          value={nutrientInfo.range.min || ""}
                          onChange={(e) => handleGoalChange(e, nutrientInfo, "min")}
                          className="nutrientGoal-editInput"
                        />
                        {" - "}
                        <input
                          type="number"
                          placeholder={nutrientInfo.range.max || "0"}
                          value={nutrientInfo.range.max || ""}
                          onChange={(e) => handleGoalChange(e, nutrientInfo, "max")}
                          className="nutrientGoal-editInput"
                        />
                      </div>
                    );
                  })}
                </section>             
            </section> 
          </section>
          <section className="navigate-editMeals-buttons">
            <button type="button" onClick={() => navigate("/meal-preferences")}>
                Go back to Kitchen and Location Preferences
              </button>
              <button type="button" onClick={() => navigate("/home")}>
                Return to Homepage
            </button>
          </section>       
        </section> 
        </form>
      </section>
    </>
  );
};

export default EditMeals;
