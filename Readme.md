# Install

Run `yarn install` or `npm install` to install all dependencies

Run `yarn set-realm` and `yarn run-android` to debug app on android device and set port forward to enable 'realm' remote debugging.

`yarn build:android` to generate signed APK


## **Tested only on android devices

## TODO
- Replace AsyncStorage with Realm

- <del>`Add Permissions` check popup on HomeScreen (https://github.com/yonahforst/react-native-permissions) </del>

- `Add Queue` to solve 30s timeout on iOS devices

- <del>`Add Listener` on Upload to keep track of files that were backed up and store info in Realm</del>

- Can remove RNFS since rn-background-upload reads image from path.

- Try to add Restore info

- Try to add Video Backup 

- Code Cleanup