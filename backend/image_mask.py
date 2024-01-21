import numpy as np
import cv2
from keras.models import load_model
import base64
import io
from imageio import imread
import tensorflow as tf
model=load_model("models/image_mask.h5")

def calculate_color_percentages(mask):
    unique, counts = np.unique(mask, return_counts=True)
    pixel_counts = dict(zip(unique, counts))
    total_pixels = np.sum(list(pixel_counts.values()))
    pc = {color: count / total_pixels * 100 for color, count in pixel_counts.items()}
    return pc

def preprocess_image(b64_string, target_size=(256, 256)):
    img = imread(io.BytesIO(base64.b64decode(b64_string)))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  
    img = cv2.resize(img, target_size)
    img = img / 255.0  
    img = np.expand_dims(img, axis=0) 
    predicted_masks = model.predict(img)
    predicted_masks[predicted_masks >= 0.5] = 1
    predicted_masks[predicted_masks < 0.5] = 0
    return predicted_masks