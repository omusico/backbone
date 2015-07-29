'use strict';

var React = require('react-native');
var RNMetaWear = require('NativeModules').RNMetaWear;

var {
  StyleSheet,
  Image,
  View,
  Text,
  Component,
  TouchableHighlight,
} = React;

var deviceWidth = (require('Dimensions').get('window').width * .85);
var deviceWidthButton = (require('Dimensions').get('window').width * .75);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  setPostureButton: {
    justifyContent: 'center',
    backgroundColor: '#48BBEC',
    borderColor: '#ccc',
    borderWidth: 4,
    borderRadius: 8,
    height: 50,
    width: deviceWidthButton,
    margin: 15,
    padding: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  postureCalibrated: {
    color: 'green',
    fontSize: 14,
    fontWeight: 'bold',
    margin: 10,
  }
});

var PosturePage = React.createClass({
  getInitialState: function() {
    return {
      buttonPressed: false,
    };
  },
  togglePostureButton: function() {
    RNMetaWear.setPosturePoint();
    var context = this;
    this.setState({
      buttonPressed: true,
    }, function() {
      setTimeout(function() {
        context.setState({
          buttonPressed: false,
        });
      }, 5000);
    });
  },
  render: function() {
    var postureCalibrated = this.state.buttonPressed ? (<Text style={styles.postureCalibrated}>Posture calibrated!</Text>) : (<View />)
    return (
      <View style={styles.container}>
      <TouchableHighlight style={styles.setPostureButton} onPress={this.togglePostureButton}>
        <Text style={styles.buttonText}>Calibrate Posture Settings</Text>
      </TouchableHighlight>
      <View>
        {postureCalibrated}
      </View>
      </View>
    )
  },
})

module.exports = PosturePage;
