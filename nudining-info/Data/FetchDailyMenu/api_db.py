import requests
import json
import time

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',  # Indicate that we expect Brotli encoding
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://nudining.com',
    'Referer': 'https://nudining.com/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
}

locationID = {
    "Stetson_East": '586d05e4ee596f6e6c04b527',
    "Stetson_West": '65ef4de5c625af0775329cb8',
    "IV": '5f4f8a425e42ad17329be131',
}
periods = {
    "Stetson_East": {
        "Breakfast": '67585060c625afb54e6c1e82',
        "Lunch": '67585060c625afb54e6c1e82',
        "Dinner": '67585060c625afb54e6c1e6a',
        "Everyday": '67585060c625afb54e6c1e6b',
    },

    "Stetson_West" : {
        "Lunch": '677208f1c625af05f6230b74',
        "Dinner": '677208f1c625af05f6230b7e',
        "Everyday": '677208f1c625af05f6230b7f'
    },
    "IV" : {
        "Breakfast": '6768c747e45d430840197c7d',
        "Lunch": '6768c747e45d430840197c77',
        "Dinner": '6768c747e45d430840197c8e',
        "Everyday": '6768c747e45d430840197c7e',
    },
}



def generate_url(location_name, period_name):
    location_id = locationID.get(location_name)
    period_id = periods.get(location_name, {}).get(period_name)
    
    if not location_id or not period_id:
        raise ValueError(f"Invalid location '{location_name}' or period '{period_name}'")
    
    # Construct URL using the selected location and period
    base_url = "https://api.dineoncampus.com/v1/location"
    url = f"{base_url}/{location_id}/periods"
    return url



def fetch_data(location_name, period_name, date):
    try:
        url = generate_url(location_name, period_name)
        params = {
            'platform': 0,
            'date': date,
        }

        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
                
    except ValueError as e:
        print(f"Configuration error: {str(e)}")
        return None
    except Exception as e:
        print(f"Unexpected error fetching data for {location_name} during {period_name}: {str(e)}")
        return None


'''
#Test Purposes
location_name = "Stetson_East"
period_name = "Lunch"
date = '2024-12-5'

filename = f"{location_name}_{period_name}_{date}.json"

data = fetch_data(location_name, period_name, date)

if data is not None:
    try:
        with open(filename, 'w') as json_file:  # Open a file for writing
            json.dump(data, json_file, indent=4)  # Write data to JSON file with indentation
        print(f"Data has been saved to {filename}.json")
    except ValueError as e:
        print(f"Error creating DataFrame: {e}")
else:
    print("No data fetched")
'''





