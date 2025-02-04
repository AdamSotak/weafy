#include <WiFiNINA.h>
#include <ArduinoJson.h> 

const char* ssid = "<SSID>";
const char* password = "<PASSWORD>";

// Server URL and endpoint paths
const char* server = "<SERVER_ADDRESS>";
const int port = 443;
const String plantEndpoint = "/api/ingress/plant";
const String apiKey = "demo";

// Device configuration
const String device_id = "<DEVICE_ID>";

// Initialize WiFi client
WiFiClient client;

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi!");
}

void loop() {
  // Collect plant data
  float touchTemp = readTemperature();
  int soilMoisture = map(analogRead(A1), 0, 1023, 100, 0);

  DynamicJsonDocument plantData(200);
  plantData["device_id"] = device_id;
  plantData["temperature"] = touchTemp;
  plantData["soil_moisture"] = soilMoisture;

  sendData(plantData, plantEndpoint);

  delay(60000);
}

float readTemperature() {
  int touchTempInput = analogRead(A2);
  float compResist = 10000 * (1023.0 / (float)touchTempInput - 1.0);
  float temperature = (1.0 / (0.001129148 + (0.000234125 * log(compResist)) +
                  0.0000000876741 * log(compResist) * log(compResist) * log(compResist))) - 273.15;
  Serial.print("Touch temp: ");
  Serial.print(temperature);
  Serial.println("°C");
  return temperature;
}

void sendData(DynamicJsonDocument &data, String endpoint) {
  if (client.connect(server, port)) {
    // Serialize data to JSON
    String jsonData;
    serializeJson(data, jsonData);

    // Send HTTP POST request
    client.println("POST " + endpoint + " HTTP/1.1");
    client.println("Host: " + String(server));
    client.println("Content-Type: application/json");
    client.println("Authorization: " + apiKey);
    client.println("Content-Length: " + String(jsonData.length()));
    client.println();
    client.print(jsonData);

    // Read server response
    while (client.connected() || client.available()) {
      if (client.available()) {
        String line = client.readStringUntil('\n');
        Serial.println(line);
      }
    }
    client.stop();
    Serial.println("Data sent successfully to " + endpoint);
  } else {
    Serial.println("Connection to server failed");
  }
}
