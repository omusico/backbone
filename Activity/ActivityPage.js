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
      shouldUpdate: false,
    };
  },
  setChartDays: function(days) {
    var chartData;
    if (this.state.chartData) {
      chartData = this.state.chartData.slice(-(days * 2));
    } else {
      chartData = [1, 1];
    }
    return chartData;
  },
  setXLabels: function(days) {
    var xLabels;
    if (this.state.xLabels) {
      xLabels = this.state.xLabels.slice(-(days));
    } else {
      xLabels = ['Today'];
    }
    return xLabels;
  },
  setStepCount: function(days) {
    var stepCount;
    if (this.state.stepCount) {
      stepCount = this.state.stepCount.slice(-(days));
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
        var ref = new Firebase('https://sweltering-fire-6261.firebaseio.com/');
        var newActivity = {};
        newActivity[currentDate] = {dayActive: 1, dayInactive: 1};
        var usersRef = ref.child('users');
        usersRef.child(context.props.userID).set({
          activity: newActivity
        });
      } else {
        var activeData = snapshot.val().activity[currentDate].dayActive;
        var inactiveData = snapshot.val().activity[currentDate].dayInactive;
        var shouldUpdate = false;

        if (currentDate !== snapshot.val().currentDate) {
          shouldUpdate = true;
        }

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
          shouldUpdate: shouldUpdate,
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
