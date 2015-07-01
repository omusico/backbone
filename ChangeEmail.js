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
    var emailToggle = this.state.changingEmail ? (<View><View style={styles.container}>
          <View style={styles.textInput}>
            <Text style={styles.loginText}>Old email</Text>
            <TextInput style={styles.inputBox} keyboardType="email-address" placeholder={this.props.email} editable={false} />
            <Text style={styles.loginText}>New email</Text>
            <TextInput style={styles.inputBox} keyboardType="email-address" onChange={this.updateEmail} />
            <Text style={styles.loginText}>Password</Text>
            <TextInput style={styles.inputBox} secureTextEntry={true} onChange={this.updatePassword} />
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableHighlight style={styles.editButton} onPress={this.saveNewEmail}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.editButton} onPress={this.toggleEmail}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableHighlight>
        </View></View>) : (<TouchableHighlight style={styles.button} onPress={this.toggleEmail}>
                <Text style={styles.buttonText}>Change email</Text>
              </TouchableHighlight>);
    var emailMessage = this.state.attemptEmailChange ? (
      <View>
        <Text style={{fontWeight: 'bold', color: this.state.messageColor}}>{this.state.message}</Text>
      </View>
      ) :
    (<View />)
    return (
      <View>
        {emailMessage}
        {emailToggle}
      </View>
    )
  }
})

module.exports = ChangeEmail;
