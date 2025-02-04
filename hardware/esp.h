#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h> 

#define DHT_PIN 4           // GPIO4 (D2 on NodeMCU)
#define DHT_TYPE DHT11
DHT dht(DHT_PIN, DHT_TYPE);

const char* ssid = "<SSID>";
const char* password = "<PASSWORD>";

const char* server = "<SERVER_ADDRESS>";
const int port = 443;
const String oxygenEndpoint = "/api/ingress/oxygen";
const String apiKey = "demo";

const String device_id = "<DEVICE_ID>";

WiFiClient client;

void setup() {
  Serial.begin(115200);
  dht.begin();
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
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  float light = analogRead(A0);
  DynamicJsonDocument oxygenData(200);
  oxygenData["device_id"] = device_id;
  oxygenData["temperature"] = temperature;
  oxygenData["humidity"] = humidity;
  oxygenData["light"] = light;

  // Send data to the server
  sendData(oxygenData);

  delay(60000);
}

void sendData(DynamicJsonDocument &data) {
  if (client.connect(server, port)) {
    // Serialize JSON data
    String jsonData;
    serializeJson(data, jsonData);

    // Send POST request
    client.println("POST " + oxygenEndpoint + " HTTP/1.1");
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
    Serial.println("Data sent successfully to " + String(oxygenEndpoint));
  } else {
    Serial.println("Connection to server failed");
  }
}
