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

api_key = "************"


def get_traffic_data(location):
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={location}&destination={location}&mode=driving&key={api_key}"
    response = requests.get(url)
    data = json.loads(response.text)
    return data["routes"][0]["legs"][0]["duration_in_traffic"]["value"]

def get_traffic_color(traffic_duration):
    if traffic_duration < 60:
        return "green"  # Low traffic
    elif traffic_duration < 120:
        return "yellow"  # Moderate traffic
    else:
        return "red"  # High traffic

def analyze_traffic(location):
    traffic_duration = get_traffic_data(location)
    traffic_color = get_traffic_color(traffic_duration)

    print(f"Traffic in {location}: {traffic_color}")

    map = folium.Map(location=location)
    folium.Marker(location=location, popup=f"Traffic: {traffic_color}").add_to(map)
    map.save("traffic_map.html")

# Example usage
location = getCurrentLocation()
analyze_traffic(location)