#import "RNMetaWear.h"

@interface RNMetaWear ()
@end

@implementation RNMetaWear

// The React Native bridge needs to know our module
RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport {
  return @{@"greeting": @"Welcome to the DevDactic\n React Native Tutorial!"};
}

RCT_EXPORT_METHOD(connectToMetaWear) {
  [[MBLMetaWearManager sharedManager] startScanForMetaWearsWithHandler:^(NSArray *array) {
    [[MBLMetaWearManager sharedManager] stopScanForMetaWears];
    MBLMetaWear *device = [array firstObject];
    __block int shakeCount = 0;
    
    [device connectWithHandler:^(NSError *error) {
      if (!error) {
        MBLAccelerometerMMA8452Q *accelerometerMMA8452Q = (MBLAccelerometerMMA8452Q *)device.accelerometer;
        [accelerometerMMA8452Q.shakeEvent startNotificationsWithHandler:^(id obj, NSError *error) {
          ++shakeCount;
          if (shakeCount == 10) {
            shakeCount = 0;
          }
          NSLog(@"Shake count %i", shakeCount);
        }];
      }
    }];
  }];

}

@end
