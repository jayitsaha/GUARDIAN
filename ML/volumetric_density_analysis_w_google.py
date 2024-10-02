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

api_key = "***************************"

def get_popular_places(location):
  url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&type=landmark|tourist_attraction|park|shopping_center|restaurant&radius=1000&key={api_key}"
  response = requests.get(url)
  data = json.loads(response.text)
  return data["results"]

def get_traffic_data(location):
  url = f"https://maps.googleapis.com/maps/api/directions/json?origin={location}&destination={location}&mode=driving&key={api_key}"
  response = requests.get(url)
  data = json.loads(response.text)
  return data["routes"][0]["legs"][0]["duration_in_traffic"]["value"]

def analyze_volumetric_analysis(location):
  popular_places = get_popular_places(location)
  traffic_data = get_traffic_data(location)


  map = folium.Map(location=location)
  for place in popular_places:
    folium.Marker(location=place["geometry"]["location"], popup=place["name"]).add_to(map)
  map.save("volumetric_analysis.html")

# Example usage
location = getCurrentLocation()
analyze_volumetric_analysis(location)