import torch
import torch.nn as nn
from flask import Flask, request, jsonify

app = Flask(__name__)

dir = './models'
api_key = "demo"

class RatePredictionModel(nn.Module):  # Predicts the rate of moisture decrease
    def __init__(self, input_dim):
        super(RatePredictionModel, self).__init__()
        self.fc1 = nn.Linear(input_dim, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 1)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return x

def predict_time_to_threshold(current_soil_moisture, features):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = RatePredictionModel(input_dim=len(features))
    model.load_state_dict(torch.load(
        f'{dir}/rate_prediction_model.pth',
        map_location=device
    ))
    model = model.to(device)
    model.eval()
    
    features_tensor = torch.tensor(features, dtype=torch.float32).to(device).unsqueeze(0)
    
    with torch.no_grad():
        predicted_rate = model(features_tensor).item()

    print(predicted_rate)
    
    if predicted_rate < 0:
        time_to_threshold = (current_soil_moisture - 35) / abs(predicted_rate)
    else:
        time_to_threshold = float('inf')
    
    return time_to_threshold

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if request.headers.get('Authorization') != api_key:
            return jsonify({'error': 'Invalid API key'}), 401
        
        data = request.get_json()
        
        # Extract features from JSON
        features = [
            data['soil_temperature'],
            data['soil_moisture'],
            data['temperature'],
            data['humidity'],
            data['light']
        ]

        print(features)
        
        time_estimate = predict_time_to_threshold(
            data['soil_moisture'], 
            features
        )
        
        # Convert infinity to null for JSON compatibility
        if time_estimate == float('inf'):
            time_estimate = None
        
        return jsonify({
            'time_to_threshold': time_estimate,
            'units': 'seconds'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)