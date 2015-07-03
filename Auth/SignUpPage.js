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

var styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
    marginTop: 30,
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },
  signupText: {
    margin: 5,
    fontSize: 24
  },
  signup: {
    flex: 1,
    alignItems: 'stretch',
    height: 35,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 35,
  },
  buttonView: {
    marginRight: 25,
    marginTop: 10,
    alignSelf: 'center',
  },
  button: {
    height: 35,
    width: 200,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    justifyContent: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
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
      passwordAgain: '',
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
  updatePasswordAgain: function(e) {
    this.setState({
      passwordAgain: e.nativeEvent.text
    });
  },
  addUserData: function(userData, email, ref) {
    console.log('USER DATA ', userData, 'REF ', ref);
    var usersRef = ref.child('users');
    usersRef.child(userData.uid).set({
      activityData: [1, 5, 4, 3, 7, 2, 8],
      inActivityData: [9, 5, 6, 7, 3, 8, 2],
      postureData: [1, 5, 4, 3, 7, 2, 8],
      badPostureData: [9, 5, 6, 7, 3, 8, 2],
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
    if (this.state.password !== this.state.passwordAgain) {
      this.setState({
        isLoading: false,
        messageColor: 'red',
        message: "Passwords do not match, try again!"
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
        debugger;
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
          <TextInput style={styles.signup} keyboardType="email-address" placeholder="john@example.com" onChange={this.updateEmail} />
        </View>
        <View style={styles.textInput}>
          <Text style={styles.signupText}>Password</Text>
          <TextInput style={styles.signup} secureTextEntry={true} placeholder="********" onChange={this.updatePassword} />
        </View>
        <View style={styles.textInput}>
          <Text style={styles.signupText}>Re-enter Password</Text>
          <TextInput style={styles.signup} secureTextEntry={true} placeholder="********" onChange={this.updatePasswordAgain} />
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
