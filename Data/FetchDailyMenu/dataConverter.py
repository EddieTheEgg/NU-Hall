import json
import pandas as pd
from api_db import fetch_data  # Import the function from api-db.py

locations = ["Stetson_East", "Stetson_West", "IV"]
periods = ["Breakfast", "Lunch", "Dinner"]

# Test Cases
date = '2024-12-5'

# Combine all dining options into one CSV file
all_menu_items = []  # List to hold all menu items

for location in locations:
    for period in periods:
        try:
            # Fetch data from the API for each location and period
            data = fetch_data(location, period, date)

            if data is not None:
                categories = data["menu"]["periods"]["categories"]

                for kitchen in categories:
                    kitchen_name = kitchen["name"]
                    for item in kitchen["items"]:
                        item_data = {
                            "Location": location,
                            "Period": period,   
                            "Kitchen": kitchen_name,
                            "Dish_Name": item["name"],
                            "Description": item["desc"],
                            "Portion_Size": item["portion"],
                            "Ingredients": item["ingredients"],
                        }
                        for nutrient in item["nutrients"]:
                            nutrient_name = nutrient["name"]
                            nutrient_value = nutrient["value"]

                            # Check for specific phrases and convert to 0.0 if found
                            if isinstance(nutrient_value, str) and (
                                "less than 1 gram" in nutrient_value or 
                                "less than 1 gram+" in nutrient_value or 
                                "-" in nutrient_value or
                                "less than 5 milligrams" in nutrient_value
                            ):
                                nutrient_value = 0.0  # Convert to 0.0
                            elif isinstance(nutrient_value, str) and nutrient_value.endswith('+'):
                                nutrient_value = nutrient_value[:-1]  # Remove the '+' at the end

                            item_data[nutrient_name] = nutrient_value

                        item_data["Allergens"] = ", ".join([f["name"] for f in item["filters"] if f["type"] == "allergen" or f["icon"] == True])

                        all_menu_items.append(item_data)

        except Exception as e:
            print(f"Error fetching data for Location: {location}, Period: {period}. Error: {e}")
            continue  # Skip to the next iteration

df = pd.DataFrame(all_menu_items)

df.to_csv(f'{date}.csv', index=False)