import React, { Component } from 'react';
import {
  ImageBackground,
  Text,
  View
} from 'react-native';
import styles from '../../styles';
import PropTypes from 'prop-types'

class ImageProcessing extends Component {
    static propTypes = {
        extractedText: PropTypes.string,
        imageSource: PropTypes.object
    }    

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flex:1, width:500}}>
                    <ImageBackground resizeMode={'cover'} source={this.props.imageSource} style={{flex:1}}>
                    <View
                        style={{
                        position: 'absolute',
                        top: 39,
                        left: 161,
                        height: 50,
                        width: 149,
                        borderWidth: 1
                        }}
                    />
                    <View
                        style={{
                        position: 'absolute',
                        top: 95,
                        left: 24,
                        height: 50,
                        width: 83,
                        borderWidth: 1
                        }}
                    />                                      
                    </ImageBackground>
                </View>
                <View style={{flex:1, backgroundColor:"yellow"}}>
                    <Text>{this.props.extractedText}</Text>
                </View>
            </View>        
        );
    }
}

ImageProcessing.navigationOptions = {
  title: 'Image Processing',
};

export default ImageProcessing;
