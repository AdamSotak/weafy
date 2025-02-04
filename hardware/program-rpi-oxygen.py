import time
import requests
import random

# Endpoint URL
URL = "<SERVER_ADDRESS>"

# Config object
config = {
    "api_key": "demo",
    "device_id": "<DEVICE_ID>",
    "temperature_pin": 26,
    "moisture_pin": 20,
    "type": "oxygen",
}

def get_plant_sensor_data():
    # Replace this with actual sensor read code
    # humidity, temperature = Adafruit_DHT.read_retry(SENSOR, PIN)
    
    # Simulated sensor data (remove this if reading from a real sensor)
    temperature = round(random.uniform(20, 30), 2)  # Random temperature in °C
    soil_moisture = round(random.uniform(0, 100), 2)  # Random soil moisture in %

    # In case of a failed read (None values), you could handle here
    if temperature is None or soil_moisture is None:
        print("Failed to read sensor data")
        return None

    # Construct data dictionary
    data = {
        "device_id": config["device_id"],
        "temperature": temperature,
        "soil_moisture": soil_moisture,
        "created_at": int(time.time())
    }
    return data

def get_oxygen_sensor_data():
    # Replace this with actual sensor read code

    temperature = round(random.uniform(0, 100), 2)  # Random temperature in %
    humidity = round(random.uniform(0, 100), 2)  # Random humidity in %
    light = round(random.uniform(0, 100), 2)  # Random light in %

    data = {
        "device_id": config["device_id"],
        "temperature": temperature,
        "humidity": humidity,
        "light": light,
    }
    return data

def send_data(data):
    # Convert data to JSON and send it via POST request
    headers = {"Authorization": f"{config['api_key']}", 'Content-Type': 'application/json'}
    try:
        typed_url = f"{URL}/{config['type']}"
        print(typed_url)
        response = requests.post(typed_url, json=data, headers=headers)
        response.raise_for_status()
        print("Data sent successfully:", data)
    except requests.exceptions.RequestException as e:
        print("Error sending data:", e)
        print("Device ID:", config["device_id"], " might not be registered in the database")

def main():
    while True:
        if config["type"] == "plant":
            sensor_data = get_plant_sensor_data()
        else:
            sensor_data = get_oxygen_sensor_data()
        if sensor_data:
            send_data(sensor_data)
        time.sleep(1)  # Wait for 15 seconds

if __name__ == "__main__":
    main()
