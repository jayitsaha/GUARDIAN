# -*- coding: utf-8 -*-

import os
import pandas as pd
from vertexai.generative_models import GenerativeModel
import pandas as pd
import re
import string
from bs4 import BeautifulSoup
import nltk
from nltk.stem import PorterStemmer
from nltk.stem.wordnet import WordNetLemmatizer
import spacy


data = pd.read_csv("social_media_data.csv")

nlp = spacy.load('en_core_web_sm')

model = GenerativeModel("gemini-1.5-flash-002") 


def clean_text(text, stem="None"):

    final_string = ""

    text = text.lower()
    text = re.sub(r'\n', '', text)

    translator = str.maketrans('', '', string.punctuation)
    text = text.translate(translator)

    text = text.split()
    useless_words = nltk.corpus.stopwords.words("english")
    useless_words = useless_words + ['hi', 'im']

    text_filtered = [word for word in text if not word in useless_words]

    text_filtered = [re.sub(r'\w*\d\w*', '', w) for w in text_filtered]

    if stem == 'Stem':
        stemmer = PorterStemmer() 
        text_stemmed = [stemmer.stem(y) for y in text_filtered]
    elif stem == 'Lem':
        lem = WordNetLemmatizer()
        text_stemmed = [lem.lemmatize(y) for y in text_filtered]
    elif stem == 'Spacy':
        text_filtered = nlp(' '.join(text_filtered))
        text_stemmed = [y.lemma_ for y in text_filtered]
    else:
        text_stemmed = text_filtered

    final_string = ' '.join(text_stemmed)

    return final_string

data["text"] = data["text"].apply(clean_text)

def extract_username(text):
    username = data['uid']
    return username

data["username"] = data["text"].apply(extract_username)

data["sentiment"] = data["text"].apply(lambda text: TextBlob(text).sentiment.polarity)


def analyze_threat(text):
    prompt = f"Analyze the following text for potential threats: {text}"
    response = model.generate_content([prompt])

    threat_keywords = ["violence", "hate", "misinformation"]  
    for keyword in threat_keywords:
        if keyword in response.lower():
            print("TRIGGER ACTION")

def generate_report(data, model):
    report = {}
    report["overall_sentiment"] = data["sentiment"].mean()
    report["threats"] = []
    report['threat_summary'] = ""
    for index, row in data.iterrows():
        threat_info = analyze_threat(row["text"])
        if threat_info:
            report["threats"].append(threat_info)
            prompt = f"""
    Please provide a crisp actionable summary for the threat report.
    The Threat Report is Following:
    {threat_info}
    Do not make up any information that is not part of the threat report and do not be verbose.
  """
    contents = [prompt]

    response = model.generate_content(contents)

    report['threat_summary'] = response.text


    return report


api_key = os.getenv("VERTEX_AI_API_KEY")

if not api_key:
    raise ValueError("Missing VERTEX_AI_API_KEY environment variable")

# Initialize Vertex AI
vertexai.init(project="********", location="us-central1")  

# Load Gemini model

report = generate_report(data, model)

print(report)



