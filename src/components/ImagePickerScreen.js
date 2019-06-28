import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
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
const tessOptions = {
  whitelist: null,
  blacklist: null
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
        //this.setState({ imageSource: source, hasErrored: false, errorMessage: null }, this.extractTextFromImage(response.path));
        RNMlKitOcr.detect(response.path).then(result => {
          // do something with the data
          //console.log(JSON.parse(result))
          //this.setState({ imageSource: source, hasErrored: false, errorMessage: null, isLoading: false, extractedText: result });
          this.setState({ imageSource: source, hasErrored: false, errorMessage: null }, this.extractTextFromImageUsingMLKit(response.path));
        })            
        //this.setState({ imageSource: source, hasErrored: false, errorMessage: null }, this.extractTextFromImageUsingMLKit(response.path));
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
      console.log(JSON.parse(result))
      this.setState({ isLoading: false, extractedText: result });
    })
  }

  render() {
    const { errorMessage, extractedText, hasErrored, imageSource, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <Button onPress={this.selectImage} >
          <View style={[styles.image, styles.imageContainer, !imageSource && styles.rounded]}>
            {
              imageSource === null
                ? <Text>Tap me!</Text>
                : <Image style={styles.image} source={imageSource} />
            }
          </View>
        </Button>
        {
          isLoading
            ? <ActivityIndicator size="large" />
            : (
              hasErrored
                ? <Text>{errorMessage}</Text>
                : <Text>{extractedText}</Text>
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
