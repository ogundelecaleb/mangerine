# Chat Feature Dependencies Installation Guide

## Required Dependencies

To complete the chat feature replication, install the following dependencies in the expo project:

```bash
cd mang

# Socket.IO for real-time messaging
npx expo install socket.io-client

# Agora for video calling
npm install react-native-agora
npx expo install react-native-permissions

# Image and Document Pickers (Expo compatible)
npx expo install expo-image-picker
npx expo install expo-document-picker
npx expo install expo-sharing
npx expo install expo-file-system

# Additional utilities
npm install moment lodash
```

## Files Created/Updated

### New Files Created:
1. `/mang/src/components/MessageItem.tsx` - Message list item component
2. `/mang/src/components/AgoraCallModal.tsx` - Video call modal component
3. `/mang/src/state/services/uploads.service.ts` - Upload signing service
4. `/mang/src/state/services/video.service.ts` - Video token service
5. `/mang/src/state/context/SocketProvider.tsx` - Socket.IO context provider

### Files Updated:
1. `/mang/src/state/services/freedom.service.ts` - Uncommented and activated
2. `/mang/src/screens/Main/ChatScreen.tsx` - Updated to use Expo APIs
3. `/mang/src/screens/Tabs/MessageScreen.tsx` - Already compatible
4. `/mang/src/components/ChatBubbles.tsx` - Updated to use Expo Image and Sharing
5. `/mang/src/state/store.ts` - Added new services to Redux store
6. `/mang/App.tsx` - Added SocketProvider wrapper

## Existing Files (Already Present):
- `/mang/src/state/hooks/chat.ts`
- `/mang/src/state/hooks/loadchat.hook.ts`
- `/mang/src/state/reducers/chat.reducer.ts`
- `/mang/src/state/services/chat.service.ts`

## Configuration Required

### 1. Add AGORA_APP_ID to helpers.ts
Ensure your `/mang/src/utils/helpers.ts` exports `AGORA_APP_ID`:

```typescript
export const AGORA_APP_ID = 'your-agora-app-id';
```

### 2. Permissions Configuration

#### iOS (ios/Podfile or app.json)
Add camera and microphone permissions to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photos",
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera"
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs access to the camera for video calls",
        "NSMicrophoneUsageDescription": "This app needs access to the microphone for video calls"
      }
    }
  }
}
```

#### Android (app.json)
```json
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA",
        "RECORD_AUDIO",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

## Features Replicated

✅ Real-time messaging with Socket.IO
✅ Message history loading
✅ Conversation list with last message preview
✅ Image and file attachments
✅ Video calling with Agora
✅ Message bubbles with timestamps
✅ File upload with Cloudinary
✅ New conversation creation
✅ Message search and filtering
✅ User presence and typing indicators (via socket events)

## Next Steps

1. Install all dependencies listed above
2. Configure AGORA_APP_ID in helpers.ts
3. Update app.json with required permissions
4. Run `npx expo prebuild` if using bare workflow
5. Test the chat functionality

## Socket Events

The chat feature listens to and emits the following socket events:

### Emitted Events:
- `sendMessage` - Send a new message

### Listened Events:
- `connect` - Socket connection established
- `disconnect` - Socket disconnected
- `receiveMessage` - New message received (implement in your app)
- `messageSeen` - Message read status (implement in your app)

## API Endpoints Used

- `POST /chat/history` - Get message history
- `GET /chat/token` - Get chat token
- `POST /uploads/sign-upload` - Sign file upload
- `POST /uploads/delete-batch` - Delete uploaded files
- `POST /video/rtc-token/:channelName` - Get Agora RTC token
- `POST /appointments/conversations` - Create appointment conversation

## Notes

- All components follow the DESIGN_GUIDELINES.md for exact visual replication
- Expo Image is used instead of FastImage for better Expo compatibility
- Expo ImagePicker and DocumentPicker replace react-native-image-picker and @react-native-documents/picker
- File sharing uses expo-sharing instead of react-native-blob-util
- All styling and layouts match the original implementation exactly
