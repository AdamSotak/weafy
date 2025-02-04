import requests
import pandas as pd
import matplotlib.pyplot as plt

server = "<SERVER_ADDRESS>"

def get_data(device, start_date, end_date):
    headers = {
        "Authorization" : "demo"
    }
    params = {
        "start_date": start_date,
        "end_date": end_date
    } 
    if device == "plant":
        response = requests.get(params=params, url = server + "/api/egress/plant/ml", headers=headers)
    elif device == "oxygen":
        response = requests.get(params=params, url = server + "/api/egress/oxygen/ml", headers=headers)
    else:
        raise ValueError("Device must be either 'plant' or 'oxygen'")
    df = pd.DataFrame(response.json())
    df = df.sort_values(by="createdAt", ascending=True)
    return df



if __name__ == '__main__':
    plant_data = get_data(device = "plant", start_date="2021-01-01", end_date="2025-01-01")
    plt.figure(figsize=(10, 5))
    plt.plot(plant_data["createdAt"], plant_data["temperature"], label="Soil Temperature")
    plt.xlabel("Date")
    plt.ylabel("Temperature")
    plt.title("Soil Temperature Over Time")
    plt.legend()
    plt.show()
    
    plt.figure(figsize=(10, 5))
    plt.plot(plant_data["createdAt"], plant_data["moistureLevel"], label="Soil Humidity")
    plt.xlabel("Date")
    plt.ylabel("Humidity")
    plt.title("Soil Humidity Over Time")
    plt.legend()
    plt.show()

    oxygen_data = get_data(device = "oxygen", start_date="2021-01-01", end_date="2025-01-01")
    plt.figure(figsize=(10, 5))
    plt.plot(oxygen_data["createdAt"], oxygen_data["temperature"], label="Temperature")
    plt.xlabel("Date")
    plt.ylabel("Temperature")
    plt.title("Temperature Over Time")
    plt.legend()
    plt.show()
    
    plt.figure(figsize=(10, 5))
    plt.plot(oxygen_data["createdAt"], oxygen_data["humidity"], label="Humidity")
    plt.xlabel("Date")
    plt.ylabel("Humidity")
    plt.title("Humidity Over Time")
    plt.legend()
    plt.show()

    plt.figure(figsize=(10, 5))
    plt.plot(oxygen_data["createdAt"], oxygen_data["light"], label="Light")
    plt.xlabel("Date")
    plt.ylabel("Light")
    plt.title("Light Over Time")
    plt.legend()
    plt.show()

