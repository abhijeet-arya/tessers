import sys
import io
import cv2
import base64 
import numpy as np
from PIL import Image
import face_recognition


# Take in base64 string and return PIL image
def stringToImage(base64_string):
    
    imgdata = base64.b64decode(base64_string)
    toRGB(Image.open(io.BytesIO(imgdata)))

# convert PIL Image to an RGB image( technically a numpy array ) that's compatible with opencv
def toRGB(image):
    # img=cv2.resize(np.array(image),(0,0),None,.25,.25)
    img =cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)
    faceLoc=face_recognition.face_locations(img)
    faceEncoding=face_recognition.face_encodings(img,faceLoc,num_jitters=100)[0]
    res=''
    for face in faceEncoding:
        res+=str(face)+","
    print(res)
    
    


if __name__ == "__main__":
    # with open('text.txt', 'r') as file:
    #     data = file.read().replace('\n', '')
    stringToImage(sys.argv[1])

  
    