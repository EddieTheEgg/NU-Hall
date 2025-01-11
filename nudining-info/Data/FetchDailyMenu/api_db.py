import requests
import brotli 
import json
import pandas as pd

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',  # Indicate that we expect Brotli encoding
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://nudining.com',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Safari/605.1.15'
}

locationID = {
    "Stetson_East": '586d05e4ee596f6e6c04b527',
    "Stetson_West": '65ef4de5c625af0775329cb8',
    "IV": '5f4f8a425e42ad17329be131',
}
periods = {
    "Stetson_East": {
        "Breakfast": '66b279bae45d4306779faaae',
        "Lunch": '66b279bae45d4306779faaca',
        "Dinner": '66b279bae45d4306779faabc',
        "Everyday": '66b279bae45d4306779faacb',
    },

    "Stetson_West" : {
        "Lunch": '6667541f351d530584146022',
        "Dinner": '6667541f351d53058414602c',
        "Everyday": '6667541f351d53058414602d'
    },
    "IV" : {
        "Breakfast": '66c3ae9a351d530107802cb1',
        "Lunch": '66c3ae9a351d530107802cc0',
        "Dinner": '66c3ae9a351d530107802ccf',
        "Everyday": '66c3ae9a351d530107802cd0',
    },
}



def generate_url(location_name, period_name):
    location_id = locationID.get(location_name)
    period_id = periods.get(location_name, {}).get(period_name)
    
    if location_id and period_id:
        # Construct URL using the selected location and period
        url = f"https://api.dineoncampus.com/v1/location/{location_id}/periods?platform=0&date={period_id}"
        return url
    else:
        print("Invalid location or period")
        return None



def fetch_data(location_name, period_name, date):
    url = generate_url(location_name, period_name)
    params = {
        'platform': 0,
        'date': date,
    }

    data = None 
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        try:
            decompressed_data = response.content.decode('utf-8')
            data = json.loads(decompressed_data) 
        except ValueError as e:
            print(f"Error parsing JSON: {e}")

    return data  # Return the fetched data


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






