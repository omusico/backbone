'use strict';

var React = require('react-native');
var HomePage = require('../HomePage');

var {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React;

var deviceWidth = (require('Dimensions').get('window').width * 0.85);
var deviceWidthButton = (require('Dimensions').get('window').width * 0.40);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: 25,
  },
  signupText: {
    margin: 5,
    fontSize: 20,
  },
  signup: {
    flex: 1,
    alignSelf: 'center',
    height: 50,
    width: deviceWidth,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  buttonView: {
    marginTop: 15,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#48BBEC',
    borderColor: '#ccc',
    justifyContent: 'center',
    height: 50,
    width: deviceWidthButton,
    borderWidth: 4,
    borderRadius: 8,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  textInput: {
    margin: 2,
  },
});

var SignUpPage = React.createClass({
  getInitialState: function() {
    return {
      email: '',
      password: '',
      message: '',
      messageColor: 'white',
      isLoading: false,
    };
  },
  updateEmail: function(e) {
    this.setState({
      email: e.nativeEvent.text
    });
  },
  updatePassword: function(e) {
    this.setState({
      password: e.nativeEvent.text
    });
  },
  addUserData: function(userData, email, ref) {
    var date = new Date();
    var currentDate = (date.getMonth() + 1) + '-' + date.getDate();
    var newActivity = {};
    newActivity[currentDate] = {dayActive: 1, dayInactive: 1, stepCount: 0};
    var usersRef = ref.child('users');
    usersRef.child(userData.uid).set({
      activity: newActivity
    });
  },
  newUser: function() {
    this.setState({
      isLoading: true
    });
    if (!this.state.email.length || !this.state.password.length) {
      this.setState({
        isLoading: false,
        messageColor: 'red',
        message: "Username/password input cannot be empty!"
      });
      return;
    }
    var context = this;
    var ref = new Firebase('https://sweltering-fire-6261.firebaseio.com/');
    ref.createUser({
      email: this.state.email,
      password: this.state.password,
    }, function(error, userData) {
      if (error) {
        context.setState({
          isLoading: false,
          messageColor: 'red',
          message: "Can't use this username, please try another!"
        });
        console.log('Error: ', error);
      } else {
        context.setState({
          isLoading: false,
          messageColor: 'green',
          message: 'Sign-up succeeded!'
        });
        context.addUserData(userData, context.state.email, ref);
        context.props.navigator.push({name: 'Home', component: HomePage, email: context.state.email, userData: userData});
      }
    });
  },
  render: function() {
    var spinner = this.state.isLoading ?
      ( <ActivityIndicatorIOS
          hidden='true'
          size='small' />) :
      (<View><Text style={{fontWeight: 'bold', color: this.state.messageColor, margin: 5}}>{this.state.message}</Text></View>)
    return (
      <View style={styles.container}>
        <View style={styles.textInput}>
          <Text style={styles.signupText}>Email</Text>
          <TextInput style={styles.signup} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholder="john@example.com" onChange={this.updateEmail} />
        </View>
        <View style={styles.textInput}>
          <Text style={styles.signupText}>Password</Text>
          <TextInput style={styles.signup} secureTextEntry={true} placeholder="********" onChange={this.updatePassword} />
        </View>
        <View style={styles.buttonView}>
          <TouchableHighlight style={styles.button} onPress={this.newUser}>
            <Text style={styles.buttonText}>Sign-up</Text>
          </TouchableHighlight>
        </View>
        <View>
          {spinner}
        </View>
      </View>
    )
  },
})

module.exports = SignUpPage;
