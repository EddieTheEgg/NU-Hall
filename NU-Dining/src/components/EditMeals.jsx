import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/editMeals.css";
import { IoIosAddCircle } from "react-icons/io";
import { IoIosInformationCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

const EditMeals = () => {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [locationPeriods, setLocationPeriods] = useState({});
  const [currentSelection, setCurrentSelection] = useState(null); // Track current period & location for meal selection
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin === window.location.origin) {
        const requestData = event.data;
        console.log("Received message:", requestData);

        if (requestData) {
          setLoading(true);
          try {
            const response = await axios.post(
              "http://localhost:8080/api/meals/generatePotentialMeals",
              requestData
            );

            console.log("Response data:", response.data);

            if (Array.isArray(response.data)) {
              setMeals(response.data); 

              const periodsFromMeals = response.data.map((meal) => meal.period);
              setPeriods([...new Set(periodsFromMeals)]); 

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
      .sort((a, b) => { //alphabetical sorting
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
    setMeals((prev) => prev.filter((m) => m.id !== meal.id)); // Remove added meal from the available list
     // setCurrentSelection(null); // Close the meal selection modal
  };

  // Handle removing a meal
  const removeMeal = (meal) => {
    setSelectedMeals((prev) => prev.filter((m) => m.id !== meal.id));
    setMeals((prev) => [...prev, meal]); // Add the removed meal back to the available list
  };

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
                    <div key={locIndex} className="create-meal-section">
                      <h3>{location.replace("_", " ")}</h3>
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
                                    <div className="select-mealDisplay">{meal.kitchen} - {meal.dishName}</div>
                                    <div className="specific-mealButtons">
                                      <IoIosInformationCircle className="information-button"/>
                                      <IoMdCloseCircle onClick={() => removeMeal(meal)} className="remove-specific-meal-button" />
                                    </div>  
                              </div>
                            ))}
                        </section>
                        <button
                          type="button"
                          className="add-meal-button"
                          onClick={() => {
                            if (currentSelection) {
                              setCurrentSelection(null);
                            } else {
                              setCurrentSelection({ period, location });
                            }
                          }}
                        >
                          +
                        </button>
                        </section>

                      {/* Modal is conditionally rendered only for the selected period and location */}
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
                                    <div className="select-mealDisplay">{meal.kitchen} - {meal.dishName}</div>
                                    <div className="specific-mealButtons">
                                      <IoIosInformationCircle className="information-button"/>
                                      <IoIosAddCircle onClick={() => addMeal(meal)} className="add-specific-meal-button" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        <section className="periodLocation-nutrientInfo">
                          <div>This is where each meal's total nutrient info will be shown</div>
                        </section>
                    </div>
                  ))}
                </section>
              </div>
            ))}
          </section>
          <section className="nutrientGoal-display">
            Nutritional Goals will be displayed in this box.
          </section>
        </form>
      </section>
    </>
  );
};

export default EditMeals;
