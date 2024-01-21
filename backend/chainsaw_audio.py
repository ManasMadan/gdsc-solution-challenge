import librosa
import librosa.display
import numpy as np
import base64
from keras.models import load_model
from io import BytesIO

model_1 =load_model("models/vgg-19-modified-reduced-layers")
def classify_audio(audio_path):
    results = []
    class conf:
        sr = 16000
        duration = 3
        hop_length = 340*duration
        fmin = 20
        fmax = sr // 2
        n_mels = 128
        n_fft = n_mels * 20
        samples = sr * duration
    def audio_to_melspectrogram(conf, audio):
        spectrogram = librosa.feature.melspectrogram(y=audio, 
                                                 sr=conf.sr,
                                                 n_mels=conf.n_mels,
                                                 hop_length=conf.hop_length,
                                                 n_fft=conf.n_fft,
                                                 fmin=conf.fmin,
                                                 fmax=conf.fmax)
        spectrogram = librosa.power_to_db(spectrogram)
        return spectrogram
    binary_data = base64.b64decode(audio_path)
    audio_bytesio = BytesIO(binary_data)
   
    sig , sr = librosa.load(audio_bytesio, sr=conf.sr)
    classes={0:'dog',1:'chainsaw',2:'crackling_fire',3:'helicopter',4:'rain',5:'crying_baby',6:'clock_tick',7:'sneezing',8:'rooster',9:'sea_waves'}
    for i in range(0,len(sig)+1,sr):
        sig_=sig[i:i+sr]
        mel_spec = audio_to_melspectrogram(conf, sig_)
        testing = np.array(mel_spec)
        testing = testing.reshape(1, testing.shape[0], testing.shape[1], 1)
        pred_1 = model_1.predict(testing)
        if classes[np.argmax(pred_1)]=="chainsaw":
            results.append({"sound_class":classes[np.argmax(pred_1)],"time_start":i/sr,"time_end":i/sr+1})
    return results