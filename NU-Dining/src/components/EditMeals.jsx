import React, { useEffect, useState } from "react";
import axios from "axios";

const EditMeals = () => {
  const [meals, setMeals] = useState([]);
  const [periods, setPeriods] = useState([]);
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

            console.log("Response data:", response.data);  // Log the response data to verify its structure

            // Ensure the response is an array before attempting to map over it
            if (Array.isArray(response.data)) {
              setMeals(response.data); // Set meals data

              // Extract periods from the response data and set it
              const periodsFromMeals = response.data.map((meal) => meal.period);
              setPeriods([...new Set(periodsFromMeals)]); // Use Set to avoid duplicates
              console.log("Unique Periods:", periodsFromMeals);
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

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <section className="main-container">
        <form>
          <section className="periods">
            <div>Periods:</div>
            {/* Ensure you return JSX from the map method */}
            {periods.map((period, index) => {
              return <div key={index}>{period}</div>; // Return JSX for each period
            })}
          </section>
          <section className="nutrientGoal-display">
            {/* Render additional content here */}
          </section>
        </form>
      </section>
    </>
  );
};

export default EditMeals;
