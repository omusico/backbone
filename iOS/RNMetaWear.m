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
//@property NSTimeInterval timeInterval;

@end

@implementation RNMetaWear

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(connectToMetaWear) {
  
  // Date objects
  self.date = [[NSDate alloc]init];
  self.formatter = [[NSDateFormatter alloc] init];
  self.startTime = [NSDate date];
  [self.formatter setDateFormat:@"M-dd"];
  
  // User-related objects
  self.counter = 0;
  self.userActive = NO;
  self.isConnected = NO;
  
  [[MBLMetaWearManager sharedManager] startScanForMetaWearsWithHandler:^(NSArray *array) {
    [[MBLMetaWearManager sharedManager] stopScanForMetaWears];
    MBLMetaWear *device = [array firstObject];
    [device connectWithHandler:^(NSError *error) {
      if (!error) {
        NSLog(@"Ok, we just connected with Handler");
        self.isConnected = YES;
        self.accelerometerMMA8452Q = (MBLAccelerometerMMA8452Q *)device.accelerometer;
      }
    }];
  }];
}

RCT_EXPORT_METHOD(syncToMetaWear:(NSString *)userid) {

  // User ID
  self.userID = userid;
  
  // Fetch current day's data from the database
  [self firebaseSyncData];
  
  self.accelerometerMMA8452Q.shakeThreshold = 0.13;
  self.accelerometerMMA8452Q.shakeWidth = 150.00;
  [self.accelerometerMMA8452Q.shakeEvent startNotificationsWithHandler:^(id obj, NSError *error) {
    [self handleShake];
  }];

}

- (void)handleShake {
  self.counter++;
  //[NSThread detachNewThreadSelector:@selector(checkForIdle) toTarget:self withObject:nil];
  if (self.counter == 10 && !self.userActive) {
    [self updateDayData];
    self.userActive = YES;
    [self stopLocalNotification];
    [self firebaseStoreUserState];
    NSLog(@"User state: Active!");
    [NSThread detachNewThreadSelector:@selector(checkForActivity) toTarget:self withObject:nil];
  } else {
    ++self.dayCounter;
    [self firebaseStoreDayData];
  }
  //self.timeInterval = [self.startTime timeIntervalSinceNow];
}

//- (void)checkForIdle {
//  int lastCounterRead = self.counter;
//  [NSThread sleepForTimeInterval:10.0f];
//  if (lastCounterRead == self.counter) {
//    NSLog(@"10 second interval passed");
//    self.counter = 0;
//  }
//}

- (void)incrementActivity {
  if (self.userActive) {
    self.dayActive += 1;
  } else {
    self.dayInactive += 1;
  }
  [self firebaseStoreDayData];
  [NSThread sleepForTimeInterval:1.0f];
  [self incrementActivity];
}

- (void)checkForActivity {
  for (int i = 1; ; i++) {
    int lastCounterRead = self.counter;
    [NSThread sleepForTimeInterval:15.0f];
    if (lastCounterRead == self.counter) {
      NSLog(@"User state: Idle for 15 seconds!");
      [self updateDayData];
      self.userActive = NO;
      [self firebaseStoreUserState];
      [self startLocalNotification];
      break;
    }
  }
}

- (void) updateDayData {
  self.counter = 0;
  NSLog(@"Total day count: %d", self.dayCounter);
  [self firebaseSyncData];
}

- (void)startLocalNotification {
  NSLog(@"Starting Local Notification");
  UIApplication *app = [UIApplication sharedApplication];

  if ([UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]) {
    [app registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert|UIUserNotificationTypeSound categories:nil]];
  }

  UILocalNotification* localNotification = [[UILocalNotification alloc] init];
  localNotification.fireDate = [NSDate dateWithTimeIntervalSinceNow: self.notificationInterval];
  localNotification.alertBody = [NSString stringWithFormat: @"You've been inactive for %i seconds!", self.notificationInterval];
  localNotification.soundName = UILocalNotificationDefaultSoundName;
  localNotification.timeZone = [NSTimeZone localTimeZone];
  [app scheduleLocalNotification:localNotification];
}

- (void)stopLocalNotification {
  NSLog(@"Canceling Local Notification");
  UIApplication *app = [UIApplication sharedApplication];
  NSArray *eventArray = [app scheduledLocalNotifications];
  if (!eventArray || ![eventArray count]) {
    NSLog(@"We couldn't find a local notification to cancel...");
  } else {
    UILocalNotification* oneEvent = [eventArray objectAtIndex:0];
    [app cancelLocalNotification:oneEvent];
  }
}

- (void)firebaseSyncData {
   Firebase *myRootRef = [[Firebase alloc] initWithUrl:@"https://sweltering-fire-6261.firebaseio.com"];
   Firebase *userRef = [[myRootRef childByAppendingPath:@"users"] childByAppendingPath:self.userID];
   Firebase *dayData = [[userRef childByAppendingPath:@"activity"] childByAppendingPath:[self.formatter stringFromDate:self.date]];
  [dayData updateChildValues:@{@"userActive": @"NO"}];
  [userRef updateChildValues:@{@"currentDate": [self.formatter stringFromDate:self.date]}];
  [dayData observeSingleEventOfType:FEventTypeValue withBlock:^(FDataSnapshot *snapshot) {
    NSNumber *dayActiveNum = snapshot.value[@"dayActive"];
    NSNumber *dayInactiveNum = snapshot.value[@"dayInactive"];
    NSNumber *stepCountNum = snapshot.value[@"stepCount"];
    self.dayActive = [dayActiveNum intValue];
    self.dayInactive = [dayInactiveNum intValue];
    self.dayCounter = [stepCountNum intValue];
    [self firebaseNotificationInterval];
    [NSThread detachNewThreadSelector:@selector(incrementActivity) toTarget:self withObject:nil];
    [self startLocalNotification];
    NSLog(@"dayActive %f, dayInactive %f, stepCount %i", self.dayActive, self.dayInactive, self.dayCounter);
  } withCancelBlock:^(NSError *error) {
    NSLog(@"%@", error.description);
  }];
}

- (void)firebaseNotificationInterval {
  Firebase *myRootRef = [[Firebase alloc] initWithUrl:@"https://sweltering-fire-6261.firebaseio.com"];
  Firebase *userRef = [[myRootRef childByAppendingPath:@"users"] childByAppendingPath:self.userID];
  Firebase *dayData = [[userRef childByAppendingPath:@"activity"] childByAppendingPath:[self.formatter stringFromDate:self.date]];
  Firebase *notificationInt = [dayData childByAppendingPath:@"notificationInterval"];
  [notificationInt observeEventType:FEventTypeValue withBlock:^(FDataSnapshot *snapshot) {
    NSNumber *notificationIntervalNum = snapshot.value;
    self.notificationInterval = [notificationIntervalNum intValue];
  }];
}

 - (void)firebaseStoreDayData {
   Firebase *myRootRef = [[Firebase alloc] initWithUrl:@"https://sweltering-fire-6261.firebaseio.com"];
   Firebase *userRef = [[myRootRef childByAppendingPath:@"users"] childByAppendingPath:self.userID];
   Firebase *dayData = [[userRef childByAppendingPath:@"activity"] childByAppendingPath:[self.formatter stringFromDate:self.date]];
   if (self.isConnected) {
   [dayData updateChildValues:@{@"stepCount": [NSNumber numberWithInt:(self.dayCounter)]}];
   } else {
     [dayData updateChildValues:@{@"stepCount": @"Connecting... please wait"}];
   }
   [dayData updateChildValues:@{@"dayActive": [NSNumber numberWithInt:(self.dayActive)]}];
   [dayData updateChildValues:@{@"dayInactive": [NSNumber numberWithInt:(self.dayInactive)]}];
 }

- (void)firebaseStoreUserState {
  Firebase *myRootRef = [[Firebase alloc] initWithUrl:@"https://sweltering-fire-6261.firebaseio.com"];
  Firebase *userRef = [[myRootRef childByAppendingPath:@"users"] childByAppendingPath:self.userID];
  Firebase *userActive = [[userRef childByAppendingPath:@"activity"] childByAppendingPath:[self.formatter stringFromDate:self.date]];
  [userActive updateChildValues:@{@"userActive": self.userActive ? @"YES" : @"NO"}];
}

@end
