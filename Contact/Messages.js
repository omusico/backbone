'use strict';

var React = require('react-native');
var Firebase = require('firebase');

var {
  StyleSheet,
  Image,
  View,
  Text,
  Component,
  TextInput,
  TouchableHighlight,
  ListView,
} = React;

var deviceWidth = (require('Dimensions').get('window').width * .70);
var deviceHeight = (require('Dimensions').get('window').height * .68);
var deviceWidthButton = (require('Dimensions').get('window').width * .30);

var styles = StyleSheet.create({
  container: {
  },
  message: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  messageInput: {
    height: 50,
    width: deviceWidth,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  messageButton: {
    height: 50,
    width: deviceWidthButton,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#48BBEC'
  },
  messageText: {
    fontSize: 24,
    color: 'white',
  }
});

var Messages = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      firebaseData: null,
      dataSource: ds.cloneWithRows(this.props.firebaseData),
    };
  },
  renderRow: function(rowData, sectionID, rowID) {
    var adminType = rowData.admin !== 'You' ? (<View style={{backgroundColor: '#48BBEC'}}><Text style={{color: 'white', fontWeight: 'bold', fontSize: 14, padding: 5}}>{rowData.admin} said: </Text>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14, paddingLeft: 5, paddingBottom: 5, paddingRight: 5}}>{rowData.message} </Text></View>) : (<View><Text style={{color: 'black', fontWeight: 'bold', fontSize: 14, padding: 5}}>{rowData.admin} said: </Text>
        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 14, paddingLeft: 5, paddingBottom: 5, paddingRight: 5}}>{rowData.message} </Text></View>)
    return (
      <View>
        {{adminType}}
      </View>
    )
  },
  componentWillReceiveProps: function(nextProps) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      dataSource: ds.cloneWithRows(nextProps.firebaseData)
    }, function() {
      firebaseData: nextProps.firebaseData;
    })
  },
  render: function() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
      </View>
    )
  },
})

module.exports = Messages;
