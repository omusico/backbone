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
  ActivityIndicatorIOS
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -25,
    paddingBottom: 25,
  },
  activityIndicator: {
    margin: 25,
    justifyContent: 'center',
    alignSelf: 'center'
  }
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
      activityState: "NO",
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
      var snapshotValue = snapshot.val();
      var date = new Date();
      var currentDate = function() {
        if (date.getDate() > 9) {
        return (date.getMonth() + 1) + '-' + date.getDate();
        } else {
          return (date.getMonth() + 1) + '-0' + date.getDate();
        }
      };
      var currentDateValue = currentDate();
      if (!snapshotValue || !snapshotValue.activity) {
        var newActivity = {};
        newActivity[currentDateValue] = {dayActive: 1, dayInactive: 1, stepCount: 0, userActive: "NO"};
        ref.child(context.props.userID).set({
          activity: newActivity
        });
      } else {
          var counter = 0;
          var chartDataArr = [];
          var stepCountArr = [];
        for (var key in snapshotValue.activity) {
          if (counter > 7) {
            counter = 0;
            break;
          }
          chartDataArr.push(snapshotValue.activity[key].dayActive);
          chartDataArr.push(snapshotValue.activity[key].dayInactive);
          stepCountArr.push(snapshotValue.activity[key].stepCount);
          counter++;
        }
        context.setState({
          xLabels: Object.keys(snapshotValue.activity),
          chartData: chartDataArr,
          stepCount: stepCountArr,
          activeData: snapshotValue.activity[currentDateValue].dayActive,
          inactiveData: snapshotValue.activity[currentDateValue].dayInactive,
          activityState: snapshotValue.activity[currentDateValue].userActive,
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
        style={styles.activityIndicator} />) :
    (<ScrollableTabView>
      <OneDayChart chartData={this.state.chartData.slice(-2)}
        xLabels={this.state.xLabels.slice(-1)}
        stepCount={this.state.stepCount.slice(-1)}
        activeData={this.state.activeData}
        inactiveData={this.state.inactiveData}
        userActive={this.state.activityState}
        tabLabel="Today" />
      <ThreeDayChart chartData={this.setChartDays(4)}
        xLabels={this.setXLabels(4)}
        stepCount={this.setStepCount(4)}
        tabLabel="3 Days" />
      <FiveDayChart chartData={this.setChartDays(6)}
        xLabels={this.setXLabels(6)}
        stepCount={this.setStepCount(6)}
        tabLabel="5 Days" />
      <OneWeekChart chartData={this.setChartDays(8)}
        xLabels={this.setXLabels(8)}
        stepCount={this.setStepCount(8)}
        tabLabel="1 Week" />
    </ScrollableTabView>)
    return (
      <View style={styles.container}>
        {spinner}
      </View>
    )
  },
})

module.exports = ActivityPage;
