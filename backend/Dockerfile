# Use official Python runtime as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install any needed packages (currently none, but keeping for future)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory
COPY . .

# Create data directory for company JSON files
RUN mkdir -p data/f500_json

# Expose port 8080
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

# Run the server
CMD ["python3", "investiq_server.py"]
