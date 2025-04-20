import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/editMeals.css";
import { IoIosAddCircle } from "react-icons/io";
import { IoIosInformationCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { IoCheckmarkCircle, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom'; 

const EditMeals = () => {
  const navigate = useNavigate();
  const [originalMeals, setOriginalMeals] = useState([]);
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
              const mealsData = response.data;
              setOriginalMeals(mealsData);
              setMeals(mealsData);

              const periodsFromMeals = mealsData.map((meal) => meal.period);
              
              const customOrder = ["Breakfast", "Lunch", "Dinner"];
              const sortedPeriods = [...new Set(periodsFromMeals)].sort((a, b) => {
                  return customOrder.indexOf(a) - customOrder.indexOf(b); //if negative, a comes before b, positive, b comes before a
              });

              setPeriods(sortedPeriods);

              const periodLocationDict = mealsData.reduce((acc, meal) => {
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
    if (!originalMeals || !period || !location) {
      return [];
    }
    
    const filtered = originalMeals
      .filter((meal) => {
        const matchesPeriodAndLocation = meal.period === period && meal.location === location;
        
        if (!matchesPeriodAndLocation) {
          return false;
        }

        const isNotSelected = !selectedMeals.some(selected => {
          const isSameMeal = selected.dishName === meal.dishName && 
                           selected.kitchen === meal.kitchen &&
                           selected.period === period && 
                           selected.location === location;
          return isSameMeal;
        });
        
        return isNotSelected;
      })
      .sort((a, b) => { 
        if (a.kitchen < b.kitchen) return -1;
        if (a.kitchen > b.kitchen) return 1;
        return 0;
      });
    
    return filtered;
  };
  

  // Adds a meal
  const addMeal = (meal) => {
    setSelectedMeals(prev => [...prev, meal]);
  };

  // Removes a meal
  const removeMeal = (meal) => {
    setSelectedMeals(prev => prev.filter(m => 
      !(m.dishName === meal.dishName && 
        m.kitchen === meal.kitchen &&
        m.period === meal.period && 
        m.location === meal.location)
    ));
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
  
  
  
  
  

  const handleAddButtonClick = (period, location) => {
    setCurrentSelection(prev => {
      if (prev && prev.period === period && prev.location === location) {
        return null;
      }
      return { period, location };
    });
  };

  // Monitor state changes
  useEffect(() => {
    if (currentSelection) {
      getAvailableMeals(currentSelection.period, currentSelection.location);
    }
  }, [currentSelection]);

  useEffect(() => {
    console.log('selectedMeals changed:', selectedMeals);
  }, [selectedMeals]);

  useEffect(() => {
    console.log('originalMeals changed:', originalMeals);
  }, [originalMeals]);

  return (
    <>
      <section className="main-container">
        <form className="form-container" onSubmit={(e) => e.preventDefault()}>
          <section className="periods">
            <h2>Meal Creator:</h2>
            {periods.map((period) => (
              <div key={`period-${period}`} className="period-section">
                <h3>{period}:</h3>
                <section className="locations-per-period">
                  {locationPeriods[period]?.map((location) => (
                    <div key={`${period}-${location}`} className={mealSelectionExist(period, location) ? "selected-create-meal-section" : "create-meal-section"}>
                      <section className="create-meal-section-header">
                        <h3>{location.replace("_", " ")}</h3>
                        {mealSelectionExist(period, location) ?  
                        <IoCheckmarkCircle
                          key={`checkmark-${period}-${location}`}
                          className="complete-meal-button"
                          onClick={() => updateSelectedLocationPeriods(period, location)}                         
                        /> :  
                        <IoCheckmarkCircleOutline
                          key={`checkmark-outline-${period}-${location}`}
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
                              <div key={`selected-${period}-${location}-${meal.dishName}-${meal.kitchen}`} className="meal-added">
                                <section className="horizontal-mealBar">
                                  <div className="select-mealDisplay"><strong>{meal.kitchen}</strong> - {meal.dishName}</div>
                                  <div className="specific-mealButtons">
                                    <IoIosInformationCircle className="information-button" onClick={() => displayMealNutrient(meal)}/>
                                    <IoMdCloseCircle onClick={() => removeMeal(meal)} className="remove-specific-meal-button" />
                                  </div>
                                </section>                                  
                                {currentMealNutrient &&
                                 currentMealNutrient.dishName === meal.dishName &&(
                                  <section key={`nutrient-${period}-${location}-${meal.dishName}-${meal.kitchen}`} className="meal-nutrientInfo">                         
                                    <p><strong>Ingredients:</strong> {currentMealNutrient.ingredients}</p>
                                    {userNutritionalFocus.map(({ display, backend }) => {
                                      return (
                                        <p key={`${period}-${location}-${meal.dishName}-${meal.kitchen}-${backend}`}>
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
                          onClick={() => handleAddButtonClick(period, location)}
                        >
                          +
                        </button>
                      </section>
                      {currentSelection &&
                        currentSelection.period === period &&
                        currentSelection.location === location && (
                          <div className="meal-selection-modal">
                            <div className="meal-Selections">
                              <section className="header-mealSelections">
                                <h3>
                                  Available Meals for {currentSelection.period} at{" "} {currentSelection.location.replace("_", " ")} 
                                </h3>
                                <IoMdCloseCircle 
                                  onClick={() => setCurrentSelection(null)} 
                                  className="close-mealSelections"
                                />
                              </section>                      
                              <div>
                                {(() => {
                                  const availableMeals = getAvailableMeals(currentSelection.period, currentSelection.location);
                                  return availableMeals.map(meal => (
                                    <div key={`available-${period}-${location}-${meal.dishName}-${meal.kitchen}`} className="potential-meal-add">
                                      <section className="horizontal-mealBar">
                                        <div className="select-mealDisplay">
                                          <strong>{meal.kitchen}</strong> - {meal.dishName}
                                        </div>
                                        <div className="specific-mealButtons">
                                          <IoIosInformationCircle 
                                            className="information-button" 
                                            onClick={() => displayMealNutrient(meal)}
                                          />
                                          <IoIosAddCircle 
                                            onClick={() => addMeal(meal)} 
                                            className="add-specific-meal-button" 
                                          />
                                        </div>
                                      </section>
                                      {currentMealNutrient &&
                                       currentMealNutrient.dishName === meal.dishName && (
                                        <section key={`modal-nutrient-${period}-${location}-${meal.dishName}-${meal.kitchen}`} className="meal-nutrientInfo">
                                          <p><strong>Ingredients:</strong> {currentMealNutrient.ingredients}</p>
                                          {userNutritionalFocus.map(({ display, backend }) => (
                                            <p key={`${period}-${location}-${meal.dishName}-${meal.kitchen}-${backend}`}>
                                              <strong>{display}:</strong> {currentMealNutrient[backend] || 0}
                                            </p>
                                          ))}
                                        </section>
                                      )}
                                    </div>
                                  ));
                                })()}
                              </div>
                            </div>
                          </div>
                        )}
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
                  <p key={`${key}-summary`}>
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
                      <div key={`${nutrientInfo.backend}-goal`}>
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
