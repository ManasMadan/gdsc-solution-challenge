from flask import Flask, jsonify, request 
app = Flask(__name__) 
from image_mask import preprocess_image,calculate_color_percentages
from chainsaw_audio import classify_audio
from forest_fire import forest_preprocess

@app.route('/') 
def home(): 
    return jsonify({"error":False,"message":"Success"})

@app.route('/forest-fire',methods=['POST'])
def forest_fire():
    try:
        data = request.get_json()
        pred = forest_preprocess(data)
        return jsonify({"error":False,"message":"Success","prediction":round(pred,2)})
    except Exception as e:
        print(e)
        return jsonify({"error":True,"message":"Something Went Wrong","prediction":None})

@app.route('/voice-recording',methods=['POST'])
def voice_recording():
    try:
        data = request.get_json()
        base64data = data.get("base64data")
        out = classify_audio(base64data)
        return jsonify({"error":False,"message":"Success","prediction":out})
    except Exception as e:
        print(e)
        return jsonify({"error":True,"message":"Something Went Wrong","prediction":None})

@app.route('/image-masks',methods=['POST'])
def image_masks():
    try:
        data = request.get_json()
        base64data = data.get("base64data")
        out = preprocess_image(base64data)
        percentages = calculate_color_percentages(out[0])
        return jsonify({"error":False,"message":"Success","predictions":{"land":percentages[0],"trees":percentages[1]}})
    except Exception as e:
        print(e)
        return jsonify({"error":True,"message":"Something Went Wrong","prediction":None})



