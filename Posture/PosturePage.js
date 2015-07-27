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
var deviceWidthButton = (require('Dimensions').get('window').width * .30);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  setPostureButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#48BBEC',
    borderColor: '#ccc',
    borderWidth: 4,
    borderRadius: 8,
    height: 50,
    width: deviceWidthButton,
    margin: 15,
    padding: 5,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

var PosturePage = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
      <TouchableHighlight style={styles.setPostureButton} onPress={RNMetaWear.setPosturePoint}>
        <Text style={styles.buttonText}>Calibrate Posture Settings</Text>
      </TouchableHighlight>
      </View>
    )
  },
})

module.exports = PosturePage;
