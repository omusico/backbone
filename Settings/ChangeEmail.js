var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} = React;

var deviceWidth = (require('Dimensions').get('window').width * 0.85);
var deviceWidthButton = (require('Dimensions').get('window').width * 0.30);
var deviceHeight = (require('Dimensions').get('window').height * 0.95);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  viewSeparator: {
    paddingTop: 10,
    borderWidth: 2,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    alignItems: 'center',
    height: deviceHeight,
  },
  inputBox: {
    height: 50,
    margin: 5,
    width: deviceWidth,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'center',
  },
  loginText: {
    margin: 5,
    fontSize: 20,
  },
  editButton: {
    alignSelf: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
});

var ChangeEmail = React.createClass({
  getInitialState: function() {
    return {
      newEmail: '',
      password: '',
      changingEmail: false,
      message: '',
      messageColor: 'white',
      attemptEmailChange: false,
    };
  },
  updateEmail: function(e) {
    this.setState({
      newEmail: e.nativeEvent.text
    });
  },
  updatePassword: function(e) {
    this.setState({
      password: e.nativeEvent.text
    });
  },
  saveNewEmail: function() {
    var context = this;
    if (!this.state.password.length || !this.state.newEmail.length) {
      this.setState({
        attemptEmailChange: true,
        messageColor: 'red',
        message: 'Email/password input cannot be empty, try again!'
      });
      setTimeout(function() { context.setState({attemptEmailChange: false});}, 1500);
      return;
    }
    var ref = new Firebase("https://sweltering-fire-6261.firebaseio.com/");
    ref.changeEmail({
      oldEmail : this.props.email,
      newEmail : this.state.newEmail,
      password : this.state.password,
    }, function(error) {
      if (error === null) {
        console.log("Email changed successfully");
        context.setState({
          changingEmail: false,
          attemptEmailChange: true,
          messageColor: 'green',
          message: 'Email changed successfully!'
        });
        setTimeout(function() { context.setState({attemptEmailChange: false});}, 1500);
      } else {
        context.setState({
          attemptEmailChange: true,
          messageColor: 'red',
          message: 'Error changing email, try again!'
        });
        setTimeout(function() { context.setState({attemptEmailChange: false});}, 1500);
      }
    });
  },
  toggleEmail: function() {
    if (!this.state.changingEmail) {
      this.setState({
        changingEmail: true,
      });
      return;
    }
    this.setState({
      changingEmail: false,
    });
  },
  render: function() {
    return (
        <View style={styles.container}>
          <View style={styles.viewSeparator}>
            <Text style={styles.loginText}>Current email</Text>
            <TextInput style={styles.inputBox} keyboardType="email-address" placeholder={this.props.email} editable={false} />
            <Text style={styles.loginText}>New email</Text>
            <TextInput style={styles.inputBox} keyboardType="email-address" onChange={this.updateEmail} />
            <Text style={styles.loginText}>Password</Text>
            <TextInput style={styles.inputBox} secureTextEntry={true} onChange={this.updatePassword} />
            <TouchableHighlight style={styles.editButton} onPress={this.saveNewEmail}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight>
            <Text style={{fontWeight: 'bold', color: this.state.messageColor}}>{this.state.message}</Text>
            </View>
      </View>
    )
  }
})

module.exports = ChangeEmail;
