'use strict';

var React = require('react-native');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var RNChart = require('react-native-chart');
var Firebase = require('firebase');

var {
  StyleSheet,
  View,
  Component,
  Text,
  TouchableHighlight,
} = React;

var deviceWidth = (require('Dimensions').get('window').width * .95);
var deviceHeight = (require('Dimensions').get('window').width * .70);

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chart: {
    margin: 10,
    width: deviceWidth,
    height: deviceHeight,
  },
});

var ActivityPage = React.createClass({
  getInitialState: function() {
    return {
      chartData: null,
      xLabels: null,
    };
  },
  componentWillMount: function() {
    var context = this;
    var ref = new Firebase("https://sweltering-fire-6261.firebaseio.com/users/");
    ref.child(this.props.userID).on('value', function(snapshot) {
      var snapshotVal = snapshot.val();
      console.log('USERID', + ' + ', context.props.userID, ' + ', 'SNAPSHOT!!! ', snapshotVal, ' + ', snapshotVal.activityData, ' + ', snapshotVal.activityDate);
      context.setState({
        chartData: [
          {
            name:'BarChart',
            type:'bar',
            color1:'#48BBEC',
            color2: '#FFA500',
            widthPercent:0.6,
            data: snapshotVal.activityData,
          },
        ],
        xLabels: snapshotVal.activityDate,
      });
    }, function(errorObject) {
      console.log('The read failed: ', errorObject.code);
    });
  },
  render: function() {
    return (
        <View style={styles.container}>
          <RNChart style={styles.chart}
            chartData={this.state.chartData}
            xLabels={this.state.xLabels}>
          </RNChart>
        </View>
    )
  },
})

module.exports = ActivityPage;
