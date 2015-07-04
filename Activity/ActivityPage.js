'use strict';

var React = require('react-native');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var RNChart = require('react-native-chart');
var Firebase = require('firebase');
var OneDayChart = require('./OneDayChart');
var ThreeDayChart = require('./ThreeDayChart');
var FiveDayChart = require('./FiveDayChart');
var OneWeekChart = require('./OneWeekChart');

var {
  StyleSheet,
  View,
  Component,
  Text,
  TouchableHighlight,
  ActivityIndicatorIOS
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
      isLoading: true,
    };
  },
  setChartDays: function(days) {
    var chartData = this.state.chartData[0].data.slice(0, (days * 2));
    return chartData;
  },
  setXLabels: function(days) {
    var xLabels = this.state.xLabels.slice(0, days);
    return xLabels;
  },
  componentWillMount: function() {
    var context = this;
    var ref = new Firebase("https://sweltering-fire-6261.firebaseio.com/users/");
    ref.child(this.props.userID).on('value', function(snapshot) {
      var snapshotVal = snapshot.val();
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
        isLoading: false,
      });
    }, function(errorObject) {
      console.log('The read failed: ', errorObject.code);
    });
  },
  render: function() {
    var spinner = this.state.isLoading ?
    ( <ActivityIndicatorIOS
        hidden='true'
        size='large'
        style={{marginTop: 25}} />) :
    (<ScrollableTabView>
      <OneDayChart chartData={this.setChartDays(1)} xLabels={this.setXLabels(1)} tabLabel="Today" />
      <ThreeDayChart chartData={this.setChartDays(3)} xLabels={this.setXLabels(3)} tabLabel="3 Days" />
      <FiveDayChart chartData={this.setChartDays(5)} xLabels={this.setXLabels(5)} tabLabel="5 Days" />
      <OneWeekChart chartData={this.setChartDays(7)} xLabels={this.setXLabels(7)} tabLabel="1 Week" />
    </ScrollableTabView>)
    return (
        <View>
          {spinner}
        </View>
    )
  },
})

module.exports = ActivityPage;
