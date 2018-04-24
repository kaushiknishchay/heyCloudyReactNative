import Permissions from 'react-native-permissions';
import { Alert } from 'react-native';

function _requestPermission() {
  Permissions.request('storage').then((res) => {
    // Returns once the user has chosen to 'allow' or to 'not allow' access
    // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    if (res !== 'authorized') {
      Alert.alert('Error', 'App can not work without this permission.');
    }
  });
}

export default function doPermissionRequest() {
  Permissions.check('storage').then((response) => {
    // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    if (response === 'undetermined' || response === 'denied') {
      Alert.alert(
        'Can we access your storage?',
        'We need access so we can upload files',
        [
          {
            text: 'Deny',
            onPress: () => Alert.alert('Permission denied', 'You denied permission, app wont work!!'),
            style: 'cancel',
          },
          response === 'undetermined'
            ? { text: 'OK', onPress: _requestPermission }
            : { text: 'Open Settings', onPress: Permissions.openSettings },
        ],
      );
    } else if (response === 'restricted') {
      Alert.alert('Error', 'App needs permission to work, goto settings > app and manually give permission to app.');
    }
  });
}
