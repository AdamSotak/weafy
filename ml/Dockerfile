# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the ML model and Python files
COPY watering-inference.py .
COPY ./models ./models

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the Flask application
CMD ["python", "watering-inference.py"] 