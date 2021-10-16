from flask import Flask, request
from flask_cors import CORS
import tensorflow as tf
from keras_preprocessing import image
import requests
from PIL import Image
import numpy as np
Dlist = ["Atelectasis",
"Consolidation",
"Infiltration",
"Pneumothorax",
"Edema",
"Emphysema",
"Fibrosis",
"Effusion",
"Pneumonia",
"Pleural_Thickening",
"Cardiomegaly",
"Nodule",
"Mass"
"Hernia"]
Dname = ""
MaxPro = 0
topIndex = []
indexValues = []


app = Flask(__name__)
CORS(app)


@app.route('/',methods=["GET","POST"])
def hello_world():
    if request.method == "GET":
        return {"name":"hello world"}
    else:
        userName = request.json["name"]
        if userName =="":
            return {"data":"","status":"bad"}
        else:
            with open("image.jpeg", "wb") as file:
                imageRes = requests.get(
                    userName)
                file.write(imageRes.content)

            images = image.load_img("image.jpeg", target_size=(256, 256))
            x = image.img_to_array(images)
            x = tf.image.rgb_to_grayscale(x)
            x = np.expand_dims(x, axis=0)
            x = x / 255.0

            def load_model():
                print(("* Loading Keras model and Flask starting server...please wait until server has fully started"))
                model = tf.keras.models.load_model('kbsavedmodel.h5')
                result = model.predict(x.reshape(1, 256, 256, 1))
                result = result[0]
                tpResult = result.argsort()[-4:]
                MaxResult = np.max(result)
                index = np.where(MaxResult == result)
                index = index[0][0]
                global Dname
                global MaxPro
                global topIndex
                global indexValues
                indexValues = result.tolist()
                topIndex = tpResult.tolist()
                MaxPro = MaxResult
                Dname = Dlist[index]
                print("successfull 👍")

            load_model()
            return {"data": Dname, "probability": str(MaxPro), "status":"OK", "values":indexValues,"topIndex":topIndex}


if __name__ == '__main__':
    app.run(debug=True)
