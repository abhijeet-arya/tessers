import sys
import io
import cv2
import base64 
import numpy as np
from PIL import Image
import face_recognition
def conertToArray(faceEncode,base64_string):
    faceEncode = faceEncode[:-1]
    faceEncode=list(map(float,faceEncode.split(',')))
    
    imgdata = base64.b64decode(base64_string)
    compare(faceEncode,Image.open(io.BytesIO(imgdata)))


    
    

# convert PIL Image to an RGB image( technically a numpy array ) that's compatible with opencv
def compare(faceEncode,image):
    img =cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)
    facesCurrentFrame=face_recognition.face_locations(img)
    encodedCurrentFrame=face_recognition.face_encodings(img,facesCurrentFrame,num_jitters=10)
    

    for encodedFace,faceLoc in zip(encodedCurrentFrame,facesCurrentFrame):
        matches=face_recognition.compare_faces([faceEncode],encodedFace,.5)
        if matches[0]:
            sys.stdout.write('True')
            return
    sys.stdout.write('False')
    
if __name__=='__main__':
    conertToArray(sys.argv[1],sys.argv[2])