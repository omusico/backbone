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
});

var ChangeEmail = React.createClass({
  updateEmail: function(e) {
    console.log('STATE', this.state);
    this.setState({
      newEmail: e.nativeEvent.text
    });
  },
  render: function() {
    return (
      <View>
        <View style={styles.container}>
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
          <TouchableHighlight style={styles.editButton}>
            <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight>
        </View>
      </View>
    )
  }
})

module.exports = ChangeEmail;
