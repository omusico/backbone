var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputBox: {
    height: 35,
    width: 250,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  loginText: {
    margin: 5,
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    height: 35,
    margin: 5,
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
  },
  button: {
    height: 35,
    width: 200,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    justifyContent: 'center',
    alignSelf: 'center'
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
    var passwordToggle = this.state.changingPassword ? (<View><View style={styles.container}>
          <View style={styles.textInput}>
            <Text style={styles.loginText}>Current password</Text>
            <TextInput style={styles.inputBox} secureTextEntry={true} onChange={this.updatePassword} />
            <Text style={styles.loginText}>New password</Text>
            <TextInput style={styles.inputBox} secureTextEntry={true} onChange={this.updateNewPassword} />
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableHighlight style={styles.editButton} onPress={this.saveNewPassword}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.editButton} onPress={this.togglePassword}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableHighlight>
        </View></View>) : (<TouchableHighlight style={styles.button} onPress={this.togglePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableHighlight>);
    var passwordMessage = this.state.attemptPasswordChange ? (
      <View>
        <Text style={{fontWeight: 'bold', color: this.state.messageColor}}>{this.state.message}</Text>
      </View>
      ) :
    (<View />)
    return (
      <View>
        {passwordMessage}
        {passwordToggle}
      </View>
    )
  }
})

module.exports = ChangePassword;
