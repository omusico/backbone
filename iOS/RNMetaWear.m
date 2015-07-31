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
@property int slouchTimer;
@property int batteryLife;
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
  // App variable (used during local notification set-up)
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
  
  [self firebaseSlouchDuration];
  
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
          self.accelerometerMMA8452Q.shakeWidth = 300.00;
          [self.accelerometerMMA8452Q.shakeEvent startNotificationsWithHandler:^(id obj, NSError *error) {
            [self handleShake];
          }];
          [self flexSensor];
          [self firebaseStoreBatteryLife];
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
    [self firebaseStoreBatteryLife];
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
      [self firebaseStoreBatteryLife];
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
        self.slouchTimer++;
        NSLog(@"Slouch duration: %i", self.slouchTimer);
        if (self.slouchTimer >= self.slouchDuration) {
          [self vibrateMotor];
          self.slouchTimer = 0;
        }
      } else {
        self.slouchTimer = 0;
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
    if (!snapshot.value) {
      self.newDay = YES;
      [self firebaseSyncData];
    }
    else if (![snapshot.value[@"currentDate"] isEqualToString:[self.formatter stringFromDate:self.date]]) {
      self.newDay = YES;
      [self firebaseSyncData];
    } else {
      self.newDay = NO;
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
      NSLog(@"notificationInterval is now... %i", self.notificationInterval);
    }
    [self startLocalNotification];
  }];
}

- (void)firebaseSlouchDuration {
  Firebase *slouchInt = [self.userFirebase childByAppendingPath:@"slouchDuration"];
  [slouchInt observeEventType:FEventTypeValue withBlock:^(FDataSnapshot *snapshot) {
    if (snapshot.value == (id)[NSNull null]) {
      [slouchInt updateChildValues:@{@"slouchDuration": @10}];
      self.slouchDuration = 10;
    } else {
      self.slouchDuration = [snapshot.value[@"slouchDuration"] intValue];
      NSLog(@"slouchDuration is now... %i", self.slouchDuration);
    }
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

- (void) firebaseStoreBatteryLife {
  NSLog(@"battery life check");
  [self.device readBatteryLifeWithHandler:^(NSNumber *number, NSError *error) {
    if (error) {
      NSLog(@"There's an error: %@", error);
      return;
    } else if (number.intValue < 20) {
      if ([UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]) {
        [self.app registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert|UIUserNotificationTypeSound categories:nil]];
      }
      
      UILocalNotification* localNotification = [[UILocalNotification alloc] init];
      localNotification.fireDate = [NSDate dateWithTimeIntervalSinceNow: 5];
      localNotification.alertBody = [NSString stringWithFormat: @"Backbone battery life is less than 20 percent, charge needed soon!"];
      localNotification.soundName = UILocalNotificationDefaultSoundName;
      localNotification.timeZone = [NSTimeZone localTimeZone];
      [self.app scheduleLocalNotification:localNotification];
    }
    self.batteryLife = number.intValue;
    NSLog(@"battery life is %i", self.batteryLife);
    Firebase *batteryLife = [self.userFirebase childByAppendingPath:@"batteryLife"];
    [batteryLife updateChildValues:@{@"batteryLife": [NSNumber numberWithInt:self.batteryLife]}];
  }];
};

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
