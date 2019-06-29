import React, { Component } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ImageProcessing from './ImageProcessing';
//import RNTesseractOcr from 'react-native-tesseract-ocr';
import styles from '../../styles';
import RNMlKitOcr from 'react-native-ml-kit-ocr';

const Button = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableOpacity;
const imagePickerOptions = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true,
  },
};

class ImagePickerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      extractedText: null,
      hasErrored: false,
      imageSource: null,
      isLoading: false,
    };
    this.selectImage = this.selectImage.bind(this);
  }

  selectImage() {
    this.setState({ isLoading: true });

    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      if (response.didCancel) {
        this.setState({ isLoading: false });
      } else if (response.error) {
        this.setState({ isLoading: false, hasErrored: true, errorMessage: response.error });
      } else {
        const source = { uri: response.uri };
        this.setState({ imageSource: source, hasErrored: false, errorMessage: null }, this.extractTextFromImageUsingMLKit(response.path));
      }
    });
  }

  /*extractTextFromImage(imagePath) {
    RNTesseractOcr.recognize(imagePath, 'LANG_ENGLISH', tessOptions)
      .then((result) => {
        this.setState({ isLoading: false, extractedText: result });
      })
      .catch((err) => {
        this.setState({ hasErrored: true, errorMessage: err.message });
      });
  }*/

  extractTextFromImageUsingMLKit(imagePath) {
    //console.log(imagePath)
    RNMlKitOcr.detect(imagePath).then(result => {
      // do something with the data
      
      this.setState({ isLoading: false, extractedText: result });
    })
  }

  render() {
    const { errorMessage, extractedText, hasErrored, imageSource, isLoading } = this.state;
    return (
      <View style={styles.container}>
        {
          imageSource === null
            ? <Button onPress={this.selectImage} >
                <View style={[styles.image, styles.imageContainer, !imageSource && styles.rounded]}>
                  {
                    <Text>Tap me!</Text>
                  }
                </View>
              </Button>
            : <ImageProcessing imageSource={imageSource} extractedText={extractedText}/>
        }
        {
          isLoading
            ? <ActivityIndicator size="large" />
            : (
              hasErrored ? <Text>{errorMessage}</Text> : <Text></Text>
            )
        }
      </View>
    );
  }
}

ImagePickerScreen.navigationOptions = {
  title: 'Image Picker Example',
};

export default ImagePickerScreen;
