#import "RNMetaWear.h"
#import <Foundation/Foundation.h>

@interface RNMetaWear ()

@property BOOL userActive;
@property BOOL isConnected;
@property NSDate *startTime;
@property NSDate *date;
@property NSDateFormatter *formatter;
@property NSString *userID;
@property int counter;
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
  self.startTime = [NSDate date];
  [self.formatter setDateFormat:@"M-dd"];
  
  // User-related objects
  self.counter = 0;
  self.userActive = NO;
  self.isConnected = NO;
  
}

RCT_EXPORT_METHOD(connectToMetaWear:(NSString *)userid) {
  
  // User ID
  self.userID = userid;
  
  // Firebase variables
  self.userFirebase = [[[[Firebase alloc] initWithUrl:@"https://sweltering-fire-6261.firebaseio.com"] childByAppendingPath:@"users"] childByAppendingPath: self.userID];
  
  // Fetch current day's data from the database and set notification interval
  [self firebaseSyncData];
  [self firebaseNotificationInterval];
  
  [self startLocalNotification];
  
  
  //Connect with MetaWear and initiate shake event listener
  [[MBLMetaWearManager sharedManager] startScanForMetaWearsWithHandler:^(NSArray *array) {
    for (MBLMetaWear *device in array) {

      // Reject if the signal strength is too low to be close enough
      if (device.discoveryTimeRSSI.integerValue < -60) {
        NSLog(@"signal strength is too low to be close enough");
        continue;
      }
      
      [[MBLMetaWearManager sharedManager] stopScanForMetaWears];
      
      [device connectWithHandler:^(NSError *error) {
        if (!error) {
          [NSThread detachNewThreadSelector:@selector(incrementActivity) toTarget:self withObject:nil];
          
          NSLog(@"Connected to device successfully!");
          self.isConnected = YES;
          
          self.accelerometerMMA8452Q = (MBLAccelerometerMMA8452Q *)device.accelerometer;
          self.device = device;
          
          self.accelerometerMMA8452Q.shakeThreshold = 0.13;
          self.accelerometerMMA8452Q.shakeWidth = 150.00;
          [self.accelerometerMMA8452Q.shakeEvent startNotificationsWithHandler:^(id obj, NSError *error) {
            [self handleShake];
          }];
        }
      }];
    }
  }];

}

- (void)handleShake {
  self.counter++;
  [NSThread detachNewThreadSelector:@selector(checkForIdle) toTarget:self withObject:nil];
  if (self.counter == 10 && !self.userActive) {
    self.counter = 0;
    self.userActive = YES;
    [self stopLocalNotification];
    NSLog(@"User state: Active!");
    [self firebaseStoreUserState];
    [NSThread detachNewThreadSelector:@selector(checkForActivity) toTarget:self withObject:nil];
  } else {
    ++self.dayCounter;
    [self firebaseStoreActivity];
  }
}

- (void)incrementActivity {
  if (self.userActive) {
    self.dayActive++;
  } else {
    self.dayInactive++;
  }
  [self firebaseStoreActivity];
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
      break;
    }
  }
}

- (void)vibrateMotor {
  NSLog(@"Bzzzttt... %@", self.device);
  [self.device.hapticBuzzer startHapticWithDutyCycle:248 pulseWidth:500 completion:nil];
}

- (void)flexSensor {
  NSLog(@"Reading value...");
  [self.device.gpio.pins[0] setConfiguration:MBLPinConfigurationPulldown];
  MBLGPIOPin *readOut = self.device.gpio.pins[1];
  MBLEvent *periodicRead = [readOut.analogRatio periodicReadWithPeriod:1000];
  
  [periodicRead startNotificationsWithHandler:^(MBLNumericData *obj, NSError *error) {
    if (!error) {
      NSLog(@"The numeric value is...%f", obj.value.floatValue);
    }
  }];
}

- (void)startLocalNotification {
  NSLog(@"Starting Local Notification");
  
  if ([UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]) {
    [self.app registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert|UIUserNotificationTypeSound categories:nil]];
  }
  UILocalNotification* localNotification = [[UILocalNotification alloc] init];
  localNotification.fireDate = [NSDate dateWithTimeIntervalSinceNow: self.notificationInterval];
  localNotification.alertBody = [NSString stringWithFormat: @"You've been inactive for %i minutes!", self.notificationInterval];
  localNotification.soundName = UILocalNotificationDefaultSoundName;
  localNotification.timeZone = [NSTimeZone localTimeZone];
  [self.app scheduleLocalNotification:localNotification];
}

- (void)stopLocalNotification {
  NSLog(@"Canceling Local Notification");
  NSArray *eventArray = [self.app scheduledLocalNotifications];
  if (!eventArray || ![eventArray count]) {
    NSLog(@"We couldn't find a local notification to cancel...");
  } else {
    UILocalNotification* oneEvent = [eventArray objectAtIndex:0];
    [self.app cancelLocalNotification:oneEvent];
  }
}

- (void)firebaseSyncData {
   Firebase *syncData = [[self.userFirebase childByAppendingPath:@"activity"] childByAppendingPath:[self.formatter stringFromDate:self.date]];
  [syncData updateChildValues:@{@"userActive": @"NO"}];
  [self.userFirebase updateChildValues:@{@"currentDate": [self.formatter stringFromDate:self.date]}];
  [syncData observeSingleEventOfType:FEventTypeValue withBlock:^(FDataSnapshot *snapshot) {
    NSNumber *dayActiveNum = snapshot.value[@"dayActive"];
    NSNumber *dayInactiveNum = snapshot.value[@"dayInactive"];
    NSNumber *stepCountNum = snapshot.value[@"stepCount"];
    self.dayActive = [dayActiveNum intValue];
    self.dayInactive = [dayInactiveNum intValue];
    self.dayCounter = [stepCountNum intValue];
    [self firebaseStoreActivity];
  } withCancelBlock:^(NSError *error) {
    NSLog(@"%@", error.description);
  }];
}

- (void)firebaseNotificationInterval {
  Firebase *notificationInt = [self.userFirebase childByAppendingPath:@"notificationInterval"];
  [notificationInt observeEventType:FEventTypeValue withBlock:^(FDataSnapshot *snapshot) {
    NSNumber *notificationIntervalNum = snapshot.value;
    self.notificationInterval = [notificationIntervalNum intValue];
  }];
}

 - (void)firebaseStoreActivity {
   Firebase *dayData = [[self.userFirebase childByAppendingPath:@"activity"] childByAppendingPath:[self.formatter stringFromDate:self.date]];
   if (self.isConnected) {
     [dayData updateChildValues:@{@"stepCount": [NSNumber numberWithInt:(self.dayCounter)]}];
   } else {
     [dayData updateChildValues:@{@"stepCount": @"Syncing with device..."}];
   }
   [dayData updateChildValues:@{@"dayActive": [NSNumber numberWithInt:(self.dayActive)]}];
   [dayData updateChildValues:@{@"dayInactive": [NSNumber numberWithInt:(self.dayInactive)]}];
 }

- (void)firebaseStoreUserState {
  Firebase *userActive = [[self.userFirebase childByAppendingPath:@"activity"] childByAppendingPath:[self.formatter stringFromDate:self.date]];
  [userActive updateChildValues:@{@"userActive": self.userActive ? @"YES" : @"NO"}];
}

@end
