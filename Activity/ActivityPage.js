'use strict';

var React = require('react-native');
var ScrollableTabView = require('react-native-scrollable-tab-view');
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
      chartData: null,
      xLabels: null,
      stepCount: null,
      isLoading: true,
      activeData: 0,
      inactiveData: 0,
    };
  },
  setChartDays: function(days) {
    var chartData;
    if (this.state.chartData) {
      chartData = this.state.chartData.slice(-(days * 2));
    } else {
      chartData = [1, 1];
    }
    chartData.pop();
    chartData.pop();
    return chartData;
  },
  setXLabels: function(days) {
    var xLabels;
    if (this.state.xLabels) {
      xLabels = this.state.xLabels.slice(-(days));
    } else {
      xLabels = ['Today'];
    }
    xLabels.pop();
    return xLabels;
  },
  setStepCount: function(days) {
    var stepCount;
    if (this.state.stepCount) {
      stepCount = this.state.stepCount.slice(-(days));
      stepCount.pop();
      return stepCount;
    }
    return null;
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
      if (snapshot.val() === null || !snapshot.val().activity) {
        var newActivity = {};
        newActivity[currentDate] = {dayActive: 1, dayInactive: 1, stepCount: 0, userActive: "NO"};
        ref.child(context.props.userID).set({
          activity: newActivity
        });
      } else {
        var activeData = snapshot.val().activity[currentDate].dayActive;
        var inactiveData = snapshot.val().activity[currentDate].dayInactive;

        for (var key in snapshot.val().activity) {
          if (counter > 7) {
            counter = 0;
            break;
          }
          chartDataArr.push(snapshot.val().activity[key].dayActive);
          chartDataArr.push(snapshot.val().activity[key].dayInactive);
          stepCountArr.push(snapshot.val().activity[key].stepCount);
          counter++;
        }
        context.setState({
          xLabels: Object.keys(snapshot.val().activity),
          chartData: chartDataArr,
          stepCount: stepCountArr,
          activeData: activeData,
          inactiveData: inactiveData,
        }, function() {
          counter = 0;
          context.setState({
            isLoading: false,
          });
        });
      }
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
      <OneDayChart chartData={this.state.chartData.slice(-2)} xLabels={this.state.xLabels.slice(-1)} stepCount={this.state.stepCount.slice(-1)} activeData={this.state.activeData} inactiveData={this.state.inactiveData} tabLabel="Today" />
      <ThreeDayChart chartData={this.setChartDays(4)} xLabels={this.setXLabels(4)} stepCount={this.setStepCount(4)} tabLabel="3 Days" />
      <FiveDayChart chartData={this.setChartDays(6)} xLabels={this.setXLabels(6)} stepCount={this.setStepCount(6)} tabLabel="5 Days" />
      <OneWeekChart chartData={this.setChartDays(8)} xLabels={this.setXLabels(8)} stepCount={this.setStepCount(8)} tabLabel="1 Week" />
    </ScrollableTabView>)
    return (
      <View>
        {spinner}
      </View>
    )
  },
})

module.exports = ActivityPage;
