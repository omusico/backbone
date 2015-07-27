#import "RNMetaWear.h"
#import <Foundation/Foundation.h>

@interface RNMetaWear ()

@property BOOL userActive;
@property BOOL isConnected;
@property BOOL newDay;
@property BOOL isSynced;
@property NSDate *date;
@property NSDateFormatter *formatter;
@property NSString *userID;
@property int counter;
@property int slouchDuration;
@property float posturePoint;
@property float flexSensorValue;
@property int dayCounter;
@property int notificationInterval;
@property double dayActive;
@property double dayInactive;
@property MBLAccelerometerMMA8452Q *accelerometerMMA8452Q;
@property MBLMetaWear *device;
@property Firebase *userFirebase;
@property UIApplication *app;

@end

@implementation RNMetaWear

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setConstants) {
  // App variable (used during local notifcation set-up)
  self.app = [UIApplication sharedApplication];
  
  // Date objects
  self.date = [[NSDate alloc]init];
  self.formatter = [[NSDateFormatter alloc] init];
  [self.formatter setDateFormat:@"M-dd"];
  
  // User-related objects
  self.counter = 0;
  self.userActive = NO;
  self.isConnected = NO;
  self.dayCounter = 0;
  self.dayActive = 1;
  self.dayInactive = 1;
  self.isSynced = NO;
}

RCT_EXPORT_METHOD(setPosturePoint) {
  NSLog(@"Setting posture point");
  Firebase *postureInt = [self.userFirebase childByAppendingPath:@"posturePoint"];
  [postureInt updateChildValues:@{@"posturePoint":[NSNumber numberWithFloat: self.flexSensorValue]}];
}

RCT_EXPORT_METHOD(connectToMetaWear:(NSString *)userid) {
  
  // User ID
  self.userID = userid;
  
  // Firebase variables
  self.userFirebase = [[[[Firebase alloc] initWithUrl:@"https://sweltering-fire-6261.firebaseio.com"] childByAppendingPath:@"users"] childByAppendingPath: self.userID];
  
  // Fetch current day's data from the database and set notification interval
  [self firebaseCheckDate];
  
  [self firebaseNotificationInterval];
  
  [self firebasePosturePoint];
  
  [[MBLMetaWearManager sharedManager] startScanForMetaWearsWithHandler:^(NSArray *array) {
    for (MBLMetaWear *device in array) {
      
      [[MBLMetaWearManager sharedManager] stopScanForMetaWears];
      
      [device connectWithHandler:^(NSError *error) {
        if (!error) {
          [NSThread detachNewThreadSelector:@selector(incrementActivity) toTarget:self withObject:nil];
          
          NSLog(@"Connected to device successfully!");
          self.isConnected = YES;
          
          self.accelerometerMMA8452Q = (MBLAccelerometerMMA8452Q *)device.accelerometer;
          self.device = device;
          
          self.accelerometerMMA8452Q.shakeThreshold = 0.11;
          self.accelerometerMMA8452Q.shakeWidth = 200.00;
          [self.accelerometerMMA8452Q.shakeEvent startNotificationsWithHandler:^(id obj, NSError *error) {
            [self handleShake];
          }];
          [self flexSensor];
        }
      }];
      break;
    }
  }];

}

- (void)handleShake {
  NSLog(@"handleShake");
  self.counter++;
  [NSThread detachNewThreadSelector:@selector(checkForIdle) toTarget:self withObject:nil];
  if (self.counter == 10 && !self.userActive) {
    self.counter = 0;
    self.userActive = YES;
    [self stopLocalNotification];
    NSLog(@"User state: Active!");
    [self firebaseStoreUserState];
    [self vibrateMotor];
    [NSThread detachNewThreadSelector:@selector(checkForActivity) toTarget:self withObject:nil];
  } else {
    ++self.dayCounter;
    [self firebaseStoreStepActivity];
  }
}

- (void)incrementActivity {
  if (self.userActive) {
    self.dayActive++;
  } else {
    self.dayInactive++;
  }
  [self firebaseStoreDayActivity];
  [NSThread sleepForTimeInterval:1.0f];
  [NSThread detachNewThreadSelector:@selector(incrementActivity) toTarget:self withObject:nil];
}

/* If lastCounterRead subtracted from self.counter is less than 10 (user took less than 10 steps in 10 seconds)
 * then reset self.counter.
 */
- (void)checkForIdle {
  int lastCounterRead = self.counter;
  [NSThread sleepForTimeInterval:10.0f];
  if ((self.counter - lastCounterRead) < 10) {
    self.counter = 0;
  }
}

- (void)checkForActivity {
  for (int i = 1; ; i++) {
    int lastCounterRead = self.counter;
    [NSThread sleepForTimeInterval:10.0f];
    if ((self.counter - lastCounterRead) < 10) {
      NSLog(@"User state: Idle for 10 seconds!");
      self.counter = 0;
      self.userActive = NO;
      [self firebaseStoreUserState];
      [self startLocalNotification];
      [self vibrateMotor];
      break;
    }
  }
}

- (void)vibrateMotor {
  [self.device.hapticBuzzer startHapticWithDutyCycle:200 pulseWidth:500 completion:nil];
}

- (void)flexSensor {
  [self.device.gpio.pins[0] setConfiguration:MBLPinConfigurationPulldown];
  MBLGPIOPin *readOut = self.device.gpio.pins[1];
  MBLEvent *periodicRead = [readOut.analogRatio periodicReadWithPeriod:2000];
  
  [periodicRead startNotificationsWithHandler:^(MBLNumericData *obj, NSError *error) {
    if (!error) {
      double posPoint = self.posturePoint - 0.02;
      self.flexSensorValue = obj.value.floatValue;
      //NSLog(@"The flex sensor value is...%f", self.flexSensorValue);
      if (obj.value.floatValue < posPoint) {
        self.slouchDuration++;
        NSLog(@"Slouch duration: %i", self.slouchDuration);
        if (self.slouchDuration >= 5) {
          [self vibrateMotor];
          self.slouchDuration = 0;
        }
      } else {
        self.slouchDuration = 0;
      }
    }
  }];
}

- (void)startLocalNotification {
  NSLog(@"Starting Local Notification");
  [self.app cancelAllLocalNotifications];
  
  if ([UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]) {
    [self.app registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert|UIUserNotificationTypeSound categories:nil]];
  }
    
  int timeMinutes = self.notificationInterval / 60;
  UILocalNotification* localNotification = [[UILocalNotification alloc] init];
  localNotification.fireDate = [NSDate dateWithTimeIntervalSinceNow: self.notificationInterval];
  localNotification.alertBody = [NSString stringWithFormat: @"You've been inactive for %i minute(s)!", timeMinutes];
  localNotification.soundName = UILocalNotificationDefaultSoundName;
  localNotification.timeZone = [NSTimeZone localTimeZone];
  [self.app scheduleLocalNotification:localNotification];
}

- (void)stopLocalNotification {
  NSLog(@"Canceling Local Notifications");
  [self.app cancelAllLocalNotifications];
}

- (void)firebaseSyncData {
   Firebase *syncData = [[self.userFirebase childByAppendingPath:@"activity"] childByAppendingPath:[self.formatter stringFromDate:self.date]];
  
  [syncData updateChildValues:@{@"userActive": @"NO"}];
  
  if (self.newDay) {
    [self.userFirebase updateChildValues:@{@"currentDate": [self.formatter stringFromDate:self.date]}];
    [syncData updateChildValues:@{@"dayActive": [NSNumber numberWithInt:(self.dayActive)]}];
    [syncData updateChildValues:@{@"dayInactive": [NSNumber numberWithInt:(self.dayInactive)]}];
  }
  
  [syncData observeSingleEventOfType:FEventTypeValue withBlock:^(FDataSnapshot *snapshot) {
    NSNumber *stepCountNum = snapshot.value[@"stepCount"];
    NSNumber *dayActiveNum = snapshot.value[@"dayActive"];
    NSNumber *dayInactiveNum = snapshot.value[@"dayInactive"];
    self.dayCounter = [stepCountNum intValue];
    self.dayActive = [dayActiveNum intValue];
    self.dayInactive = [dayInactiveNum intValue];
    self.isSynced = YES;
    [self firebaseStoreStepActivity];
    [self firebaseStoreDayActivity];
  } withCancelBlock:^(NSError *error) {
    NSLog(@"%@", error.description);
  }];
}

- (void)firebaseCheckDate {
  [self.userFirebase observeSingleEventOfType:FEventTypeValue withBlock:^(FDataSnapshot *snapshot) {
    if ([snapshot.value[@"currentDate"] isEqualToString:[self.formatter stringFromDate:self.date]] || !snapshot.value) {
      self.newDay = NO;
      [self firebaseSyncData];
    } else {
      self.newDay = YES;
      [self firebaseSyncData];
    }
  }];
}

- (void)firebaseNotificationInterval {
  Firebase *notificationInt = [self.userFirebase childByAppendingPath:@"notificationInterval"];
  [notificationInt observeEventType:FEventTypeValue withBlock:^(FDataSnapshot *snapshot) {
    if (snapshot.value == (id)[NSNull null]) {
      [notificationInt updateChildValues:@{@"notificationInterval": @1800}];
      self.notificationInterval = 1800;
    } else {
      self.notificationInterval = [snapshot.value[@"notificationInterval"] intValue];
    }
    [self startLocalNotification];
  }];
}

- (void)firebasePosturePoint {
  Firebase *postureInt = [self.userFirebase childByAppendingPath:@"posturePoint"];
  [postureInt observeEventType:FEventTypeValue withBlock:^(FDataSnapshot *snapshot) {
    if (snapshot.value == (id)[NSNull null] || !snapshot.value[@"posturePoint"]) {
      [postureInt updateChildValues:@{@"posturePoint": @0.55}];
      self.posturePoint = 0.55;
      NSLog(@"Posture point is... %f", self.posturePoint);
    } else {
      self.posturePoint = [snapshot.value[@"posturePoint"] floatValue];
      NSLog(@"Posture point is... %f", self.posturePoint);
    }
  }];
}

 - (void)firebaseStoreDayActivity {
   Firebase *dayData = [[self.userFirebase childByAppendingPath:@"activity"] childByAppendingPath:[self.formatter stringFromDate:self.date]];
   [dayData updateChildValues:@{@"dayActive": [NSNumber numberWithInt:(self.dayActive)]}];
   [dayData updateChildValues:@{@"dayInactive": [NSNumber numberWithInt:(self.dayInactive)]}];
 }

- (void)firebaseStoreStepActivity {
  Firebase *dayData = [[self.userFirebase childByAppendingPath:@"activity"] childByAppendingPath:[self.formatter stringFromDate:self.date]];
  if (self.isConnected && self.isSynced) {
    [dayData updateChildValues:@{@"stepCount": [NSNumber numberWithInt:(self.dayCounter)]}];
  } else {
    [self firebaseSyncData];
  }
}

- (void)firebaseStoreUserState {
  Firebase *userActive = [[self.userFirebase childByAppendingPath:@"activity"] childByAppendingPath:[self.formatter stringFromDate:self.date]];
  [userActive updateChildValues:@{@"userActive": self.userActive ? @"YES" : @"NO"}];
}

@end
