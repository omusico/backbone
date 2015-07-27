#import "RCTBridgeModule.h"
#import <MetaWear/MetaWear.h>
#import <Firebase/Firebase.h>

@interface RNMetaWear : NSObject <RCTBridgeModule>
//- (IBAction)buttonPress:(id)sender;
//- (void)checkForIdle;
- (void)checkForActivity;
- (void)checkForIdle;
- (void)startLocalNotification;
- (void)stopLocalNotification;
@end
