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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  inputBox: {
    height: 50,
    width: deviceWidth,
    margin: 5,
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
    padding: 5,
    margin: 15,
  },
  buttonText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },
});

var ChangePassword = React.createClass({
  getInitialState: function() {
    return {
      password: '',
      newPassword: '',
      changingPassword: false,
      message: '',
      messageColor: 'white',
      attemptPasswordChange: false,
    };
  },
  updatePassword: function(e) {
    this.setState({
      password: e.nativeEvent.text
    });
  },
  updateNewPassword: function(e) {
    this.setState({
      newPassword: e.nativeEvent.text
    });
  },
  saveNewPassword: function() {
    var context = this;
    if (!this.state.password.length || !this.state.newPassword.length) {
      this.setState({
        attemptPasswordChange: true,
        messageColor: 'red',
        message: 'Password input cannot be empty, try again!'
      });
      setTimeout(function() { context.setState({attemptPasswordChange: false});}, 1500);
      return;
    }
    var ref = new Firebase("https://sweltering-fire-6261.firebaseio.com/");
    ref.changePassword({
      email : this.props.email,
      oldPassword : this.state.password,
      newPassword : this.state.newPassword,
    }, function(error) {
      if (error === null) {
        console.log("Password changed successfully");
        context.setState({
          changingPassword: false,
          attemptPasswordChange: true,
          messageColor: 'green',
          message: 'Password changed successfully!'
        });
        setTimeout(function() { context.setState({attemptPasswordChange: false});}, 1500);
      } else {
        context.setState({
          attemptPasswordChange: true,
          messageColor: 'red',
          message: 'Error changing password, try again!'
        });
        setTimeout(function() { context.setState({attemptPasswordChange: false});}, 1500);
      }
    });
  },
  togglePassword: function() {
    if (!this.state.changingPassword) {
      this.setState({
        changingPassword: true,
      });
      return;
    }
    this.setState({
      changingPassword: false,
    });
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.loginText}>Current password</Text>
          <TextInput style={styles.inputBox} secureTextEntry={true} onChange={this.updatePassword} />
          <Text style={styles.loginText}>New password</Text>
          <TextInput style={styles.inputBox} secureTextEntry={true} onChange={this.updateNewPassword} />
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableHighlight style={styles.editButton} onPress={this.saveNewPassword}>
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

module.exports = ChangePassword;
