import React, { useEffect, useState } from "react";
import axios from "axios";

const EditMeals = () => {
  const [meals, setMeals] = useState([]);
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
                    setMeals(response.data);
                    console.log(response.data);
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

    // Cleanup the event listener when the component unmounts
    return () => {
        window.removeEventListener("message", handleMessage);
    };
}, []);


  return (
    <div>
      <h1>Generated Meal List:</h1>
      {loading ? (
        <p>Getting meals...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : meals.length > 0 ? (
        <ul>
          {meals.map((meal, index) => (
            <li key={index}>{meal.dishName}</li> // Replace `meal.name` with the actual property name
          ))}
        </ul>
      ) : (
        <p>No meals available based on the selected preferences.</p>
      )}
    </div>
  );
};

export default EditMeals;
