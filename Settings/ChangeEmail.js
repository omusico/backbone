var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} = React;

var deviceWidth = (require('Dimensions').get('window').width * .85);
var deviceWidthButton = (require('Dimensions').get('window').width * .30);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    height: 50,
    margin: 5,
    width: deviceWidth,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  loginText: {
    margin: 5,
    fontSize: 20,
  },
  editButton: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
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
          <View>
            <Text style={styles.loginText}>Current email</Text>
            <TextInput style={styles.inputBox} keyboardType="email-address" placeholder={this.props.email} editable={false} />
            <Text style={styles.loginText}>New email</Text>
            <TextInput style={styles.inputBox} keyboardType="email-address" onChange={this.updateEmail} />
            <Text style={styles.loginText}>Password</Text>
            <TextInput style={styles.inputBox} secureTextEntry={true} onChange={this.updatePassword} />
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableHighlight style={styles.editButton} onPress={this.saveNewEmail}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight>
          </View>
          <View>
            <Text style={{fontWeight: 'bold', color: this.state.messageColor}}>{this.state.message}</Text>
          </View>
      </View>
    )
  }
})

module.exports = ChangeEmail;
