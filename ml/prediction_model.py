from ml.extra_data import get_data
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
import pandas as pd
import os

dir = 'ml/models'

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

def train_and_save_model():
    plant_data = get_data(device="plant", start_date="2021-01-01", end_date="2025-01-01")
    oxygen_data = get_data(device="oxygen", start_date="2021-01-01", end_date="2025-01-01")
    
    plant_data = plant_data.rename(columns={'temperature': 'soil_temperature', 'moistureLevel': 'soil_moisture'})
    plant_data = plant_data[['createdAt', 'soil_temperature', 'soil_moisture']]
    oxygen_data = oxygen_data[['createdAt', 'temperature', 'humidity', 'light']]
    
    # createdAt is just an object need this for merging
    plant_data['createdAt'] = pd.to_datetime(plant_data['createdAt'])
    oxygen_data['createdAt'] = pd.to_datetime(oxygen_data['createdAt'])
    
    all_data = pd.merge_asof(plant_data, oxygen_data, on='createdAt', direction='nearest', tolerance=pd.Timedelta('15min')).dropna()
    
    test_data = all_data.iloc[-1]
    # Calculate the moisture decrease rate as the difference between consecutive soil moisture levels
    all_data['moisture_rate'] = all_data['soil_moisture'].diff()
    #Also stops the model from getting confused by watering events
    all_data['moisture_rate'] = all_data['moisture_rate'].clip(upper=0) # We are only interested in the natural decrease of moisture
    
    all_data['time_diff'] = all_data['createdAt'].diff().dt.total_seconds()
    all_data['moisture_rate'] = all_data['moisture_rate'] / all_data['time_diff']
    #all_data['moisture_rate'] = all_data['moisture_rate'].rolling(window=100).mean()

    all_data = all_data.dropna()
    all_data = all_data.reset_index(drop=True)
    
    features = all_data[['soil_temperature', 'soil_moisture', 'temperature', 'humidity', 'light']].values
    target = all_data['moisture_rate'].values
    
    # Convert to tensors
    features = torch.tensor(features, dtype=torch.float32)
    target = torch.tensor(target, dtype=torch.float32).view(-1, 1)
    
    dataset = TensorDataset(features, target)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=False)
    
    model = RatePredictionModel(input_dim=features.shape[1]) # Might be wrong :P
    model = model.cuda()
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    num_epochs = 1000 #Super overfitted consistency sake :)
    # Super bad design who cares...
    for epoch in range(num_epochs):
        for batch_features, batch_target in dataloader:
            batch_features, batch_target = batch_features.cuda(), batch_target.cuda()
            
            outputs = model(batch_features)
            loss = criterion(outputs, batch_target)
            
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
        
            #print(f"Epoch {epoch+1} - Sample Model Output: {outputs[:5].cpu().detach().numpy()}")
            #print(f"Epoch {epoch+1} - Sample Target: {batch_target[:5].cpu().detach().numpy()}")
        
        #print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')

    if not os.path.exists(dir):
        os.makedirs(dir)
    torch.save(model.state_dict(), f'{dir}/rate_prediction_model.pth')
    return test_data

def predict_time_to_threshold(current_soil_moisture, features):
    model = RatePredictionModel(input_dim=len(features))
    model.load_state_dict(torch.load(f'{dir}/rate_prediction_model.pth'))
    model = model.cuda()
    model.eval()
    
    features_tensor = torch.tensor(features, dtype=torch.float32).cuda().unsqueeze(0)
    
    with torch.no_grad():
        predicted_rate = model(features_tensor).item()
    
    if predicted_rate < 0:
        time_to_threshold = (current_soil_moisture - 35) / abs(predicted_rate)
    else:
        time_to_threshold = float('inf')
    
    return time_to_threshold

if __name__ == '__main__':
    test_data = train_and_save_model()
    
    # 'soil_temperature', 'soil_moisture', 'temperature','humidity', 'light'
    time_estimate = predict_time_to_threshold(test_data['soil_moisture'], [test_data['soil_temperature'],test_data['soil_moisture'],test_data['temperature'],test_data['humidity'],test_data['light']])
    print(f"Estimated time to reach 35% soil moisture: {time_estimate} seconds")
