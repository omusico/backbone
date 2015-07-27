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
    margin: 25,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loginText: {
    margin: 5,
    fontSize: 20,
  },
  login: {
    flex: 1,
    height: 50,
    width: deviceWidth,
    alignSelf: 'center',
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
    height: 50,
    width: deviceWidthButton,
    borderWidth: 4,
    borderRadius: 8,
    backgroundColor: '#48BBEC',
    borderColor: '#ccc',
    justifyContent: 'center',
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

var LoginPage = React.createClass({
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
  authenticateUser: function() {
    this.setState({
      isLoading: true
    });
    if (!this.state.email.length || !this.state.password) {
      this.setState({
        isLoading: false,
        messageColor: 'red',
        message: "Username/password input cannot be empty!"
      });
      return;
    }
    var context = this;
    var ref = new Firebase('https://sweltering-fire-6261.firebaseio.com/');
    ref.authWithPassword({
      email: this.state.email,
      password: this.state.password,
    }, function(error, userData) {
      if (error) {
        context.setState({
          isLoading: false,
          messageColor: 'red',
          message: 'Incorrect login, try again!'
        });
      } else {
        context.setState({
          isLoading: false,
          messageColor: 'green',
          message: 'Login successful!'
        });
        context.props.navigator.push({name: 'Home', component: HomePage, email: context.state.email, userData: userData});
      }
    });
  },
  render: function() {
    var spinner = this.state.isLoading ?
    ( <ActivityIndicatorIOS
        hidden='true'
        size='small' />) :
    (<View><Text style={{fontWeight: 'bold', color: this.state.messageColor, margin: 5}}> {this.state.message}</Text></View>)
    return (
      <View style={styles.container}>
        <View style={styles.textInput}>
          <Text style={styles.loginText}>Email</Text>
          <TextInput style={styles.login} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholder="john@example.com" onChange={this.updateEmail} />
        </View>
        <View style={styles.textInput}>
          <Text style={styles.loginText}>Password</Text>
          <TextInput style={styles.login} secureTextEntry={true} placeholder="********" onChange={this.updatePassword} />
        </View>
        <View style={styles.buttonView}>
          <TouchableHighlight style={styles.button} onPress={this.authenticateUser}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
        </View>
        <View>
          {spinner}
        </View>
      </View>
    )
  },
})

module.exports = LoginPage;
