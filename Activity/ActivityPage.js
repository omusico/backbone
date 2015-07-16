'use strict';

var React = require('react-native');
var ScrollableTabView = require('react-native-scrollable-tab-view');
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

var deviceWidth = (require('Dimensions').get('window').width * 0.95);
var deviceHeight = (require('Dimensions').get('window').width * 0.70);

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
      firebaseData: null,
      chartData: null,
      xLabels: null,
      stepCount: null,
      isLoading: true,
      activeData: null,
      inactiveData: null,
      shouldUpdate: false,
    };
  },
  setChartDays: function(days) {
    var chartData = this.state.chartData.slice(-(days * 2));
    return chartData;
  },
  setXLabels: function(days) {
    var xLabels = this.state.xLabels.slice(-(days));
    return xLabels;
  },
  setStepCount: function(days) {
    var stepCount = this.state.stepCount.slice(-(days));
    return stepCount;
  },
  componentWillMount: function() {
    var context = this;
    var ref = new Firebase("https://sweltering-fire-6261.firebaseio.com/users/");
    ref.child(this.props.userID).on('value', function(snapshot) {
      var counter = 0;
      var chartDataArr = [];
      var stepCountArr = [];
      var date = new Date();
      var currentDate = (date.getMonth() + 1) + '-' + date.getDate();
      var activeData = snapshot.val().activity[currentDate].dayActive;
      var inactiveData = snapshot.val().activity[currentDate].dayInactive;
      var shouldUpdate = false;

      if (currentDate !== snapshot.val().currentDate) {
        shouldUpdate = true;
      }

      for (var key in snapshot.val().activity) {
        if (counter > 7) {
          break;
        }
        chartDataArr.push(snapshot.val().activity[key].dayActive);
        chartDataArr.push(snapshot.val().activity[key].dayInactive);
        stepCountArr.push(snapshot.val().activity[key].stepCount);
        counter++;
      }

      context.setState({
        firebaseData: snapshot.val(),
        xLabels: Object.keys(snapshot.val().activity),
        chartData: chartDataArr,
        stepCount: stepCountArr,
        activeData: activeData,
        inactiveData: inactiveData,
        shouldUpdate: shouldUpdate,
      }, function() {
        context.setState({
          isLoading: false,
        });
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
      <OneDayChart chartData={this.setChartDays(1)} xLabels={this.setXLabels(1)} stepCount={this.setStepCount(1)} activeData={this.state.activeData} inactiveData={this.state.inactiveData} tabLabel="Today" />
      <ThreeDayChart chartData={this.setChartDays(3)} xLabels={this.setXLabels(3)} stepCount={this.setStepCount(3)} shouldUpdate={this.state.shouldUpdate} tabLabel="3 Days" />
      <FiveDayChart chartData={this.setChartDays(5)} xLabels={this.setXLabels(5)} stepCount={this.setStepCount(5)} shouldUpdate={this.state.shouldUpdate} tabLabel="5 Days" />
      <OneWeekChart chartData={this.setChartDays(7)} xLabels={this.setXLabels(7)} stepCount={this.setStepCount(7)} shouldUpdate={this.state.shouldUpdate} tabLabel="1 Week" />
    </ScrollableTabView>)
    return (
        <View>
          {spinner}
        </View>
    )
  },
})

module.exports = ActivityPage;
