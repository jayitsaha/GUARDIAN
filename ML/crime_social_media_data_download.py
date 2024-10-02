
import requests
import json
import pandas as pd

maps_api_key = "*************"
custom_search_api_key = "***********"
twitter_api_key = "**************"

def get_crime_data(location):
    url = f"https://your-crime-data-api-endpoint/{location}"
    response = requests.get(url)
    data = json.loads(response.text)
    return data["crime_data"]

def get_natural_disasters(location):
    url = f"https://your-natural-disaster-api-endpoint/{location}"
    response = requests.get(url)
    data = json.loads(response.text)
    return data["disasters"]

def get_social_media_data(query):
    url = f"https://api.twitter.com/1.1/search/tweets.json?q={query}&count=100"
    headers = {"Authorization": f"Bearer {twitter_api_key}"}
    response = requests.get(url, headers=headers)
    data = json.loads(response.text)
    return data["statuses"]

def main():
    location = "Varthur, India"  
    crime_data = get_crime_data(location)
    natural_disasters = get_natural_disasters(location)

    combined_data = crime_data + natural_disasters

    keywords = []
    for item in combined_data:
        keywords.extend(item["keywords"]) 

    social_media_posts = []
    for keyword in keywords:
        posts = get_social_media_data(keyword)
        social_media_posts.extend(posts)

    crime_df = pd.DataFrame(crime_data)
    crime_df.to_csv("crime_data.csv", index=False)

    social_media_df = pd.DataFrame(social_media_posts)
    social_media_df.to_csv("social_media_data.csv", index=False)