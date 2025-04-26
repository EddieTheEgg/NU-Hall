import { useState, useEffect } from "react";
import { IoCheckmarkCircle, IoCheckmarkCircleOutline } from 'react-icons/io5';
import "../styles/mealPref.css"; 
import axios from 'axios';

const MealPreferencesForm = () => {
    const [periods, setPeriods] = useState([]);
    const [locations, setLocations] = useState([]);
    const [kitchens, setKitchens] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [locationHours, setLocationHours] = useState([]);
    const [availableKitchens, setAvailableKitchens] = useState({});

    // Fetch available kitchens when location or period changes
    useEffect(() => {
        const fetchAvailableKitchens = async () => {
            if (locations.length > 0 && periods.length > 0) {
                const newAvailableKitchens = {};
                
                for (const location of locations) {
                    for (const period of periods) {
                        try {
                            const response = await axios.get(
                                `http://localhost:8080/api/meals/kitchens/${period}/${location}`
                            );
                            if (response.data) {
                                if (!newAvailableKitchens[location]) {
                                    newAvailableKitchens[location] = {};
                                }
                                newAvailableKitchens[location][period] = response.data;
                            }
                        } catch (error) {
                            console.error(`Error fetching kitchens for ${location} during ${period}:`, error);
                        }
                    }
                }
                setAvailableKitchens(newAvailableKitchens);
            }
        };

        fetchAvailableKitchens();
    }, [locations, periods]);

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentDateTime(now.toLocaleString().split(",")); 
        };
        updateDateTime(); 
        const intervalId = setInterval(updateDateTime, 1000); 
        return () => clearInterval(intervalId); 
    }, []);

    //Fetch API time from NUDining
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const todayDate = new Date().toISOString().split("T")[0];
                const apiUrl = `https://api.dineoncampus.com/v1/locations/weekly_schedule?site_id=5751fd2b90975b60e048929a&date=${todayDate}`;
                
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json(); 
                
                const desiredLocations = [
                    "The Eatery at Stetson East",
                    "Social House at Stetson West",
                    "United Table at International Village"
                ];

                const formatTime = (hour, minutes) => {
                    let suffix = hour >= 12 ? 'pm' : 'am';
                    let formattedHour = hour % 12; 
                    formattedHour = formattedHour ? formattedHour : 12; // JS, if 0, then return 12 for midnight
                    let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Pad single-digit minutes so 09 instead of just 9 for 7:09
                    return `${formattedHour}:${formattedMinutes}${suffix}`;
                };

                const locationsWithTodayHours = result.the_locations
                    .filter(location => desiredLocations.includes(location.name))
                    .map(location => {
                        const today = location.week.find(day => day.date === todayDate);
                        if (today) {
                            const formattedHours = today.hours.map(hour => {
                                const startTime = formatTime(hour.start_hour, hour.start_minutes);
                                const endTime = formatTime(hour.end_hour, hour.end_minutes);
                                return `${startTime} - ${endTime}`;
                            });
                            
                            return {
                                locationName: location.name,
                                status: today.status,
                                hours: formattedHours,
                                hasSpecialHours: today.has_special_hours,
                                closed: today.closed,
                                message: location.status.message,
                            };
                        }
                        return null;
                    })
                    .filter(location => location !== null);
                
                setLocationHours(locationsWithTodayHours);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };
        fetchLocations();
        const intervalId = setInterval(fetchLocations, 60000); 
        return () => clearInterval(intervalId); 
    }, []);

    const toggleSelection = (value, state, setState) => {
        if (state.includes(value)) {
            setState(state.filter((item) => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const storedData = localStorage.getItem("userProfile");
        const userProfile = storedData ? JSON.parse(storedData) : null;
    
        const requestData = {
            user: userProfile,
            periods: periods,
            locations: locations,
            kitchens: kitchens,
        };
    
        try {
            const editMealsUrl = '/edit-meals'; 
            const newTab = window.open(editMealsUrl, '_blank');
    
            if (newTab) {
                const intervalId = setInterval(() => {
                    if (newTab.document.readyState === 'complete') {
                        clearInterval(intervalId);
                        console.log("New tab loaded, sending message...");
                        newTab.postMessage(requestData, '*');
                    }
                }, 100); 
            } else {
                console.error("Failed to open new tab");
            }
        } catch (error) {
            console.error("Error opening new tab:", error);
        }
    };

    const isChecked = (item, listofItems) => listofItems.includes(item);

    const isKitchenAvailable = (kitchen, location, period) => {
        return availableKitchens[location]?.[period]?.includes(kitchen) || false;
    };

    return (
        <form onSubmit={handleSubmit} className="mealPref-form">
            <section className="operation-hours">
                <h2 className="operation-hours-title">Today's Hours of Operation</h2>
                <p><strong>Today's Date:</strong> {currentDateTime[0]}</p>
                <p><strong>Current Time:</strong> {currentDateTime[1]}</p>
                <section className="display-locationHours">
                    {locationHours.map((location) => (
                        <section key={location.locationName} className="location-openingInfo">
                            <h3>{location.locationName}</h3>
                            <div><strong>Operating Hours:</strong> {location.hours} </div>
                            <div className="location-message">{(location.status === "open") ? "Open currently!" : location.message}</div>
                        </section>
                    ))}
                </section>
            </section>
            <section className="user-mealPref">
                <section className="periods-and-locations">
                    <h3>1. Select Preferences</h3>
                    <section className="selection-row-pl">
                        <section className="periods-selection">
                            <label>Meals:</label>
                            {["Breakfast", "Lunch", "Dinner"].map((period) => (
                                <button
                                    type="button"
                                    key={period}
                                    onClick={() => {
                                        toggleSelection(period, periods, setPeriods);
                                        setKitchens([]);
                                    }}
                                    className={periods.includes(period) ? "button-chosen" : "button-not-chosen"}
                                >
                                    {isChecked(period, periods) ? <IoCheckmarkCircle className="checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className="checkmark-alignment" />}
                                    {period}
                                </button>
                            ))}
                        </section>
                        <section className="locations-selection">
                            <label>Locations:</label>
                            {["Stetson_East", "Stetson_West", "IV"].map((location) => (
                                <button
                                    type="button"
                                    key={location}
                                    onClick={() => {
                                        toggleSelection(location, locations, setLocations);
                                        setKitchens([]);
                                    }}
                                    className = {locations.includes(location) ? "button-chosen" : "button-not-chosen"}
                                >
                                    {isChecked(location, locations) ?  <IoCheckmarkCircle className= "checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className= "checkmark-alignment" />}
                                    {location == "IV" ? "International Village" : location.replace("_", " ") }
                                </button>
                            ))}
                        </section>
                    </section>
                </section>
                <section className="kitchens">
                    <div>
                        <h3>2. Select Kitchens</h3>
                        {locations.length === 0 || periods.length === 0 ? (
                            <p>Please select meal periods and locations first.</p>
                        ) : (
                            <div>
                                {locations.map((location) => (
                                    <div key={location}>
                                        <h4>{location == "IV" ? "International Village" : location.replace("_", " ")}:</h4>
                                        {periods.map((period) => (
                                            <div key={`${location}-${period}`}>
                                                <h5>{period}:</h5>
                                                {availableKitchens[location]?.[period]?.length > 0 ? (
                                                    availableKitchens[location][period].map((kitchen) => (
                                                        <button
                                                            type="button"
                                                            key={kitchen}
                                                            onClick={() => toggleSelection(kitchen, kitchens, setKitchens)}
                                                            className={kitchens.includes(kitchen) ? "button-chosen" : "button-not-chosen"}
                                                            disabled={!isKitchenAvailable(kitchen, location, period)}
                                                        >
                                                            {isChecked(kitchen, kitchens) ? <IoCheckmarkCircle className="checkmark-alignment-selected" /> : <IoCheckmarkCircleOutline className="checkmark-alignment" />}
                                                            {kitchen}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <p>No kitchens available for {period}.</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="submit-mealRequest" type="submit">Save and Continue</button>
                </section>
            </section>
        </form>
    );
};

export default MealPreferencesForm;