'use strict';

var React = require('react-native');
var Firebase = require('firebase');
var HomePage = require('./HomePage');

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
  loginText: {
    margin: 5,
    fontSize: 24
  },
  login: {
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
  }
});

var RecoveryPage = React.createClass({
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

    this.props.navigator.push({name: 'Home', component: HomePage, email: 'john@example.com'});
    // this.setState({
    //   isLoading: true
    // });

    // if (!this.state.email.length) {
    //   this.setState({
    //     isLoading: false,
    //     messageColor: 'red',
    //     message: "Email input cannot be empty!"
    //   });
    //   return;
    // }
    // var context = this;
    // var ref = new Firebase("https://sweltering-fire-6261.firebaseio.com/");
    // ref.resetPassword({
    //     email: this.state.email
    //   }, function(error) {
    //   if (error === null) {
    //     context.setState({
    //       isLoading: false,
    //       messageColor: 'green',
    //       message: "Password reset email sent, please check your inbox!"
    //     });
    //   } else {
    //     context.setState({
    //       isLoading: false,
    //       messageColor: 'red',
    //       message: "Error sending password reset email, try again!"
    //     });
    //   }
    // });
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
          <TextInput style={styles.login} keyboardType="email-address" placeholder="john@example.com" onChange={this.updateEmail} required/>
        </View>
        <View style={styles.buttonView}>
          <TouchableHighlight style={styles.button} onPress={this.authenticateUser}>
            <Text style={styles.buttonText}>Recover password</Text>
          </TouchableHighlight>
        </View>
        <View>
          {spinner}
        </View>
      </View>
    )
  },
})

module.exports = RecoveryPage;
