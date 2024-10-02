import os
import requests
import json
import time
import folium
import pandas as pd
import matplotlib.pyplot as plt

import geocoder

def getCurrentLocation():
    location = geocoder.ip('me')
    
    if location.ok:
        return {
            'latitude': location.latlng[0],
            'longitude': location.latlng[1],
            'city': location.city,
            'country': location.country
        }
    else:
        return "Unable to get location."

api_key = os.getenv("GOOGLE_MAPS_API_KEY")

if not api_key:
    raise ValueError("Missing GOOGLE_MAPS_API_KEY environment variable")
def get_libraries(location):
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&type=library&radius=1000&key={api_key}"
    response = requests.get(url)
    data = json.loads(response.text)
    return data["results"]

def get_parks(location):
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&type=park&radius=1000&key={api_key}"
    response = requests.get(url)
    data = json.loads(response.text)
    return data["results"]

def get_real_time_crime(location):
    url = f"https://your-crime-api-endpoint/crime/{location}"
    response = requests.get(url)
    data = json.loads(response.text)
    return data["crime_rate"]

def analyze_area(location, crime_threshold):
    libraries = get_libraries(location)
    parks = get_parks(location)
    crime_rate = get_real_time_crime(location)

    if crime_rate > crime_threshold:
        print(f"High crime rate detected in {location}")

    map = folium.Map(location=location)
    for library in libraries:
        folium.Marker(location=library["geometry"]["location"]).add_to(map)
    for park in parks:
        folium.Marker(location=park["geometry"]["location"]).add_to(map)
    map.save("map.html")

location = getCurrentLocation()
crime_threshold = 50  # Adjust threshold as needed
analyze_area(location, crime_threshold)