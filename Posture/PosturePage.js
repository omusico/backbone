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

var deviceWidthButton = (require('Dimensions').get('window').width * 0.75);

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
      currentSlouch: 0,
    };
  },
  componentWillMount: function() {
    var context = this;
    var ref = new Firebase("https://sweltering-fire-6261.firebaseio.com/users/");
    ref.child(this.props.userID).child('currentSlouch').on('value', function(snapshot) {
      context.setState({
        currentSlouch: snapshot.val().currentSlouch
      });
    });
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
    var slouchDetected = this.state.currentSlouch === 5 ? (<Text style={{color:'red', fontWeight:'bold', fontSize: 18}}>Slouch detected!!!</Text>) : (<Text>You've been slouching for {this.state.currentSlouch} seconds</Text>)
    var postureCalibrated = this.state.buttonPressed ? (<Text style={styles.postureCalibrated}>Posture calibrated!</Text>) : (<View />)
    return (
      <View style={styles.container}>
      <TouchableHighlight style={styles.setPostureButton} onPress={this.togglePostureButton}>
        <Text style={styles.buttonText}>Calibrate Posture Settings</Text>
      </TouchableHighlight>
      {slouchDetected}
      <View>
        {postureCalibrated}
      </View>
      </View>
    )
  },
})

module.exports = PosturePage;
