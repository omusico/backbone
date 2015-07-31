var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc'
  },
  settingsSeparator: {
    padding: 10,
    borderWidth: 2,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsView: {
    flexDirection: 'row',
    margin: 10,
  },
  settingsButton: {
    padding: 5,
    backgroundColor: '#48BBEC',
    borderRadius: 16,
    marginTop: 22,
    margin: 5,
    height: 35,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  settingsHeader: {
    fontSize: 16,
    marginBottom: 1,
  },
});

var Settings = React.createClass({
  getInitialState: function() {
    var ref = new Firebase("https://sweltering-fire-6261.firebaseio.com/users/");
    return {
      notificationInterval: null,
      slouchDuration: null,
      currentBatteryLife: 'Syncing with device...',
      updatedBatteryLife: false,
      firebaseRef: ref,
    };
  },
  changeNotification15: function() {
    this.state.firebaseRef.child(this.props.userID).child('notificationInterval').update({
      'notificationInterval': 900,
    });
  },
  changeNotification30: function() {
    this.state.firebaseRef.child(this.props.userID).child('notificationInterval').update({
      'notificationInterval': 1800,
    });
  },
  changeNotification45: function() {
    this.state.firebaseRef.child(this.props.userID).child('notificationInterval').update({
      'notificationInterval': 2700,
    });
  },
  changeNotification60: function() {
    this.state.firebaseRef.child(this.props.userID).child('notificationInterval').update({
      'notificationInterval': 3600,
    });
  },
  changeSlouchDuration5: function() {
    this.state.firebaseRef.child(this.props.userID).child('slouchDuration').update({
      'slouchDuration': 5,
    });
  },
  changeSlouchDuration10: function() {
    this.state.firebaseRef.child(this.props.userID).child('slouchDuration').update({
      'slouchDuration': 10,
    });
  },
  changeSlouchDuration15: function() {
    this.state.firebaseRef.child(this.props.userID).child('slouchDuration').update({
      'slouchDuration': 15,
    });
  },
  componentWillMount: function() {
    var context = this;
    this.state.firebaseRef.child(this.props.userID).child('notificationInterval').on('value', function(snapshot) {
      if (snapshot.val()) {
        var snapshotValue = snapshot.val().notificationInterval / 60;
        context.setState({
          notificationInterval: snapshotValue
        });
      }
    });
    this.state.firebaseRef.child(this.props.userID).child('slouchDuration').on('value', function(snapshot) {
      if (snapshot.val()) {
        var snapshotValue = snapshot.val();
        context.setState({
          slouchDuration: snapshotValue.slouchDuration
        });
      }
    });
  },
  render: function() {
    return (
        <View style={styles.container}>
          <View>
            <View style={styles.settingsSeparator}>
              <Text style={styles.settingsHeader}>Change notification interval</Text>
              <Text>(Current setting at: {this.state.notificationInterval} minutes)</Text>
              <View style={styles.settingsView}>
                <TouchableHighlight style={styles.settingsButton} onPress={this.changeNotification15}>
                  <Text style={styles.settingsText}>15m</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.settingsButton} onPress={this.changeNotification30}>
                  <Text style={styles.settingsText}>30m</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.settingsButton} onPress={this.changeNotification45}>
                  <Text style={styles.settingsText}>45m</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.settingsButton} onPress={this.changeNotification60}>
                  <Text style={styles.settingsText}>60m</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={styles.settingsSeparator}>
              <Text style={styles.settingsHeader}>Change slouch duration</Text>
              <Text>(Current setting at: {this.state.slouchDuration} seconds)</Text>
              <View style={styles.settingsView}>
                <TouchableHighlight style={styles.settingsButton} onPress={this.changeSlouchDuration5}>
                  <Text style={styles.settingsText}>5s</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.settingsButton} onPress={this.changeSlouchDuration10}>
                  <Text style={styles.settingsText}>10s</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.settingsButton} onPress={this.changeSlouchDuration15}>
                  <Text style={styles.settingsText}>15s</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View  style={styles.settingsSeparator}>
              <Text>Battery life percentage: {this.state.currentBatteryLife}</Text>
            </View>
        </View>
      </View>
    )
  }
})

module.exports = Settings;
