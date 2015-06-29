'use strict';

var React = require('react-native');
var HomePage = require('./HomePage');

var {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
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
    marginTop: 15,
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
  }
})

var SignUpPage = React.createClass({
  getInitialState: function() {
    return {
      email: null,
      password: null,
    }
  },
  updateEmail: function(e) {
    this.setState({
      email: e.nativeEvent.text
    })
  },
  updatePassword: function(e) {
    this.setState({
      password: e.nativeEvent.text
    })
  },
  newUser: function() {
    var context = this;
    var ref = new Firebase('https://sweltering-fire-6261.firebaseio.com/');
    ref.createUser({
      email: this.state.email,
      password: this.state.password,
    }, function(error, userData) {
      if (error) {
        console.log('Error: ', error);
      } else {
        context.props.navigator.push({name: 'Home', component: HomePage})
      }
    })
  },
  render: function() {
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
        <View style={styles.buttonView}>
          <TouchableHighlight style={styles.button} onPress={this.newUser}>
            <Text style={styles.buttonText}>Sign-up</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  },
})

module.exports = SignUpPage;
