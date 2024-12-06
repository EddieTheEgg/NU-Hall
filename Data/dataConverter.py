import json
import pandas as pd
from api_db import fetch_data  # Import the function from api-db.py

#Test Cases
location_name = "Stetson_East"
period_name = "Lunch"
date = '2024-12-6'

# Fetch data from the API
data = fetch_data(location_name, period_name, date)

file_name = (
    location_name + "_" + 
    period_name + "_" + 
    date + ".csv"
)

# Proceed with your existing logic to create the CSV
menu_items = []

if data is not None:
    categories = data["menu"]["periods"]["categories"]

    for kitchen in categories:
        kitchen_name = kitchen["name"]  # Corrected to access kitchen name
        for item in kitchen["items"]:
            item_data = {
                "Kitchen": kitchen_name,
                "Dish Name": item["name"],
                "Description": item["desc"],
                "Portion": item["portion"],
                "Ingredients": item["ingredients"],   
            }
            for nutrient in item["nutrients"]:
                nutrient_name = nutrient["name"]
                nutrient_value = nutrient["value"]
                item_data[nutrient_name] = nutrient_value

            item_data["Allergens"] = ", ".join([f["name"] for f in item["filters"] if f["type"] == "label" or f["type"] == "allergen"])

            menu_items.append(item_data)

    df = pd.DataFrame(menu_items)
    df.to_csv(file_name, index=False)  # Save to CSV with index=False