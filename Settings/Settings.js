var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} = React;

var deviceWidth = (require('Dimensions').get('window').width * 0.85);
var deviceWidthButton = (require('Dimensions').get('window').width * 0.30);

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
    margin: 10,
    height: 35,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

var Settings = React.createClass({
  getInitialState: function() {
    return {
      notificationInterval: 1800,
      currentBatteryLife: 'Syncing with device...',
      updatedBatteryLife: false,
    };
  },
  render: function() {
    return (
        <View style={styles.container}>
          <View>
            <View style={styles.settingsSeparator}>
              <Text>Change notification interval</Text>
              <View style={styles.settingsView}>
                <TouchableHighlight style={styles.settingsButton}>
                  <Text style={styles.settingsText}>15m</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.settingsButton}>
                  <Text style={styles.settingsText}>30m</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.settingsButton}>
                  <Text style={styles.settingsText}>45m</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.settingsButton}>
                  <Text style={styles.settingsText}>1hr</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={styles.settingsSeparator}>
              <Text>Change slouch duration</Text>
              <View style={styles.settingsView}>
                <TouchableHighlight style={styles.settingsButton}>
                  <Text style={styles.settingsText}>5s</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.settingsButton}>
                  <Text style={styles.settingsText}>10s</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.settingsButton}>
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
