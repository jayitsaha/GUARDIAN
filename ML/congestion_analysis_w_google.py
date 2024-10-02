
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


api_key = "*************************"


def get_natural_calamities(location):
    url = f"https://your-natural-calamity-api-endpoint/{location}"
    response = requests.get(url)
    data = json.loads(response.text)
    return data["calamities"]

def get_construction_data(location):
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&type=construction&radius=1000&key={api_key}"
    response = requests.get(url)
    data = json.loads(response.text)
    return data["results"]

def get_congestion_data(location):
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={location}&destination={location}&mode=driving&key={api_key}"
    response = requests.get(url)
    data = json.loads(response.text)
    return data["routes"][0]["legs"][0]["duration_in_traffic"]["value"]

def analyze_area(location):
    natural_calamities = get_natural_calamities(location)
    construction_sites = get_construction_data(location)
    congestion_level = get_congestion_data(location)

    if natural_calamities:
        print(f"Natural calamities detected in {location}: {natural_calamities}")
    if construction_sites:
        print(f"Construction sites detected in {location}: {construction_sites}")
    if congestion_level > threshold:  # Adjust threshold as needed
        print(f"High congestion detected in {location}")

    map = folium.Map(location=location)
    for calamity in natural_calamities:
        folium.Marker(location=calamity["location"], popup=calamity["type"]).add_to(map)
    for site in construction_sites:
        folium.Marker(location=site["geometry"]["location"], popup="Construction").add_to(map)
    map.save("area_analysis.html")

# Example usage
location = getCurrentLocation()
analyze_area(location)