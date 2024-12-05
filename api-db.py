import requests
import brotli #NuDining encoded format
import json
import pandas as pd

# Define the URL with query parameters
url = "https://api.dineoncampus.com/v1/location/586d05e4ee596f6e6c04b527/periods/66b279bae45d4306779faaae"
params = {
    'platform': 0,
    'date': '2024-12-5'
}

# Define the headers
headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'br',  # Indicate that we expect Brotli encoding
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://nudining.com',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Safari/605.1.15'
}

data = None  # Initialize data to None (For global scope)

# Make the GET request
response = requests.get(url, headers=headers, params=params)

content_encoding = response.headers.get('Content-Encoding')  

if response.status_code == 200 and content_encoding == 'br':
    try:
        decompressed_data = brotli.decompress(response.content).decode('utf-8')
        data = json.loads(decompressed_data)  # Parse data

    # Decompress error debug section
    except brotli.error as e:
        print(f"Brotli decompression failed: {e}")
        print("Raw response content:", response.content)  # Added for debugging
    except ValueError as e:
        print(f"Error parsing JSON: {e}")
        print("Decompressed data:", decompressed_data)

# Check if data is defined before creating DataFrame
if data is not None:
    df = pd.DataFrame(data)
    df_cleaned = pd.json_normalize(data)
    print(df_cleaned)
else:
    print("No data to create DataFrame.")