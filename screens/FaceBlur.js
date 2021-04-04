//Luke Staib 2021 ljstaib@bu.edu
//Login Screen

import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import { Styles } from '../Styles';

import * as firebase from 'firebase';

const FaceBlur =  ({
  face: {
    bounds: {
      origin: { x: posX, y: posY },
      size: { width: faceWidth, height: faceHeight },
    }
  }
}) => {
  return (
    <BlurView intensity={100} style={{ position: 'absolute', left: posX, top: posY }}>
    </BlurView>
  );
}

export default FaceBlur
