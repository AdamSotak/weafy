import time
import urequests as requests
from machine import ADC, Pin
import dht
import gc

# Endpoint URL
URL = "<SERVER_ADDRESS>"

# Config object
config = {
    "device_id": "<DEVICE_ID>",
    "temperature_pin": 26,
    "moisture_pin": 20,
    "type": "plant",
}

def get_plant_sensor_data():
    try:
        # Setup DHT22 sensor for temperature
        dht_sensor = dht.DHT22(Pin(config["temperature_pin"]))
        # Setup ADC for soil moisture
        moisture_sensor = ADC(Pin(config["moisture_pin"]))
        
        # Read temperature sensor
        dht_sensor.measure()
        temperature = dht_sensor.temperature()
        
        # Read moisture sensor (adjust values based on your sensor's range)
        moisture_raw = moisture_sensor.read_u16()
        soil_moisture = round((65535 - moisture_raw) * 100 / 65535, 2)  # Convert to percentage

        # Construct data dictionary
        data = {
            "device_id": config["device_id"],
            "temperature": temperature,
            "soil_moisture": soil_moisture,
            "created_at": time.time()
        }
        return data
    except Exception as e:
        print("Sensor reading error:", e)
        return None

def get_oxygen_sensor_data():
    try:
        # Assuming oxygen sensor on ADC
        oxygen_sensor = ADC(Pin(26))  # Adjust pin as needed
        # Assuming DHT22 for humidity
        dht_sensor = dht.DHT22(Pin(27))  # Adjust pin as needed
        
        # Read sensors
        oxygen_raw = oxygen_sensor.read_u16()
        oxygen_level = round(oxygen_raw * 100 / 65535, 2)  # Convert to percentage
        
        dht_sensor.measure()
        humidity_level = dht_sensor.humidity()

        data = {
            "device_id": config["device_id"],
            "oxygen_level": oxygen_level,
            "humidity_level": humidity_level,
            "created_at": time.time()
        }
        return data
    except Exception as e:
        print("Sensor reading error:", e)
        return None

def send_data(data):
    headers = {'Content-Type': 'application/json'}
    try:
        typed_url = f"{URL}/{config['type']}"
        response = requests.post(typed_url, json=data, headers=headers)
        print("Data sent successfully:", data)
    except Exception as e:
        print("Error sending data:", e)
    finally:
        # Clean up connection
        gc.collect()

def main():
    while True:
        if config["type"] == "plant":
            sensor_data = get_plant_sensor_data()
        else:
            sensor_data = get_oxygen_sensor_data()
        if sensor_data:
            send_data(sensor_data)
        time.sleep(15)  # Wait for 15 seconds

if __name__ == "__main__":
    main()
