import json
import pandas as pd
from api_db import fetch_data, periods as dining_periods 
import sys
import os  

locations = ["Stetson_East", "Stetson_West", "IV"]
periods = ["Breakfast", "Lunch", "Dinner"]

if len(sys.argv) > 1:
    date = sys.argv[1]
else:
    date = '2025-3-15' #Testing date purpose

# Combine all dining options into one CSV file
all_menu_items = []  # List to hold all menu items

for location in locations:
    for period in periods:

        # Skip invalid period-location combinations
        if period not in dining_periods.get(location, {}):
            print(f"Skipping {period} for {location} - not a valid combination")
            continue

        try:
            # Fetch data from the API for each location and period
            data = fetch_data(location, period, date)

            if data is None:
                print(f"No data returned for {location} during {period}, skipping...")
                continue

            # Check if data is formatted as JSON dictionary (should be from api_db.py response.json())
            if not isinstance(data, dict):
                print(f"Invalid data type returned for {location} during {period}, skipping...")
                continue

            menu = data.get("menu", {})
            periods_data = menu.get("periods", {})
            categories = periods_data.get("categories", [])

            if not categories:
                print(f"No menu categories found for {location} during {period}, skipping...")
                continue

            for kitchen in categories:
                kitchen_name = kitchen["name"]
            
                if location == "IV" and kitchen_name == "SOUP":
                    kitchen_name = "SOUP (IV)"  # Rename SOUP to SOUP (IV) to not conflict with Steast SOUP kitchen as well

                for item in kitchen["items"]:
                    item_data = {
                        "Location": location,
                        "Period": period,   
                        "Kitchen": kitchen_name, #The new name is placed here depending whether the kitchen was oreiginally a SOUP or not
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
            print(f"Error fetching data for {location} during {period}: {e}")

# Gets absolute path of this current script
script_dir = os.path.dirname(os.path.abspath(__file__))

#Join the path and the csv file name together
output_file_path = os.path.join(script_dir, f"{date}.csv")

try:
    df_menu_items = pd.DataFrame(all_menu_items)
    if not df_menu_items.empty:
        df_menu_items.to_csv(output_file_path, index=False)
        
        print(f"CSV file created successfully at: {output_file_path}")
        print(f"Absolute path of created file: {os.path.abspath(output_file_path)}")
    else:
        print("No data to write to CSV.")
except Exception as e:
    print(f"Error writing CSV file: {e}")
    print(f"Attempted to write to: {output_file_path}")