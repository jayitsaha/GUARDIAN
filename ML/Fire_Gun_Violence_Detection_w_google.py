import os
import re
import cv2
import nltk
import spacy
import string
from bs4 import BeautifulSoup
import pandas as pd
from nltk.stem import PorterStemmer
import google.generativeai as genai
from nltk.stem.wordnet import WordNetLemmatizer
from vertexai.generative_models import GenerativeModel


api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("Missing GEMINI_API_KEY environment variable")

# Configure Gemini
genai.configure(api_key=api_key)

model = GenerativeModel("gemini-1.5-flash-002") 

import os
import cv2
import google.generativeai as genai

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("Missing GEMINI_API_KEY environment variable")

genai.configure(api_key=api_key)

cap = cv2.VideoCapture(0) 

red = (0, 0, 255)
green = (0, 255, 0)
blue = (255, 0, 0)
yellow = (0, 255, 255)
purple = (128, 0, 128)


def detect_object(frame, object_type):
    try:
        prompt = f"Detect {object_type} and return bounding boxes ymin, xmin, ymax, xmax"
        response = model.generate_content([frame, prompt])

        bounding_boxes = (response.text).split(',')

        if "bounding_boxes" in locals():  
            color = get_color(object_type)  
            for box in bounding_boxes:
                x_min, y_min, x_max, y_max = box
                cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), color, 2)

    except Exception as e:
        print(f"Error detecting {object_type}: {e}")


def get_color(object_type):
    if object_type == "gun":
        return red
    elif object_type == "violence":
        return green
    elif object_type == "fire":
        return blue
    elif object_type == "traffic_jam":
        return yellow
    elif object_type == "construction":
        return purple
    else:
        raise ValueError(f"Unsupported object type: {object_type}")


while True:
    ret, frame = cap.read()

 
    detect_object(frame.copy(), "gun") 
    detect_object(frame.copy(), "violence")
    detect_object(frame.copy(), "fire")
    detect_object(frame.copy(), "traffic_jam")
    detect_object(frame.copy(), "construction")

    cv2.imshow("Object Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()