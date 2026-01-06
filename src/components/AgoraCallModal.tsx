import { Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Modal from './Modal';
import Box from './Box';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  RtcConnection,
  IRtcEngineEventHandler,
  VideoSourceType,
} from 'react-native-agora';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import { Conversation, ErrorData } from '../utils/types';
import { useAuth } from '../state/hooks/user.hook';
import Text from './Text';
import { useGetVideoTokenMutation } from '../state/services/video.service';
import { showMessage } from 'react-native-flash-message';
import { AGORA_APP_ID } from '../utils/helpers';
import MicSVG from '../assets/svgs/MicSVG';
import VideoSVG from '../assets/svgs/VideoSVG';
import PhoneSVG from '../assets/svgs/PhoneSVG';

interface Props {
  isVisible?: boolean;
  closeModal?: () => void;
  conversation: Conversation;
  caller: string;
}

// function stringToAgoraUid(str: string): number {
//   const FNV_PRIME = 0x01000193; // 16777619
//   const OFFSET_BASIS = 0x811c9dc5; // 2166136261

//   let hash = OFFSET_BASIS;

//   for (let i = 0; i < str.length; i++) {
//     // eslint-disable-next-line no-bitwise
//     hash ^= str.charCodeAt(i);
//     // eslint-disable-next-line no-bitwise
//     hash = (hash * FNV_PRIME) >>> 0; // Force unsigned 32-bit int
//   }

//   // Ensure UID is in [1, 2147483647] (non-zero positive)
//   const MAX_UID = 0x7fffffff; // 2,147,483,647
//   const safeUid = hash % MAX_UID;

//   // Avoid zero
//   return safeUid === 0 ? 12345 : safeUid;
// }

function stringToAgoraUid(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
const appId = AGORA_APP_ID;

const AgoraCallModal = ({
  isVisible,
  closeModal,
  conversation,
}: Props) => {
  const { user } = useAuth();
  const agoraEngineRef = useRef<IRtcEngine>(null);
  const [isJoined, setIsJoined] = useState(false);
  const isHost = true;
  const [remoteUid, setRemoteUid] = useState(0);
  const channelName = conversation?.id;
  const localUid = stringToAgoraUid(user?.id || '');

  const eventHandler = useRef<IRtcEngineEventHandler>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const otherUser = useMemo(
    () =>
      conversation?.consultantId === user?.id
        ? conversation?.user
        : conversation?.consultant,
    [conversation, user],
  );
  const [triggerJoin, setTriggerJoin] = useState(false);
  const [getVideoToken, {}] = useGetVideoTokenMutation();
  const [videoToken, setVideoToken] = useState('');

  const loadVideoToken = useCallback(async () => {
    try {
      if (!user?.id || !conversation?.id) {
        return;
      }
      
      // console.log('=== TOKEN REQUEST DEBUG ===');
      console.log('User ID (original):', user?.id);
      console.log('Channel Name:', conversation?.id);
      console.log('Local UID:', localUid);
      console.log('App ID:', appId);
      // console.log('========================');
      
      const response = await getVideoToken({
        channelName: conversation?.id,
        uid: localUid,
      });
      
      console.log('=== TOKEN RESPONSE ===');
      console.log('Full response:', JSON.stringify(response, null, 2));
      console.log('Token:', (response as any)?.data?.token?.substring(0, 50) + '...');
      console.log('=====================');
      
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      setVideoToken((response as any)?.data?.token || '');
    } catch (error) {
      console.log('get availability error', JSON.stringify(error));
    }
  }, [getVideoToken, conversation, user, localUid]);

  const toggleMic = () => {
    const mute = !isMicMuted;
    agoraEngineRef.current?.muteLocalAudioStream(mute);
    setIsMicMuted(mute);
  };

  const toggleCamera = () => {
    const mute = !isCameraMuted;
    agoraEngineRef.current?.muteLocalVideoStream(mute);
    setIsCameraMuted(mute);
  };

  const getPermission = async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const audioPermission = await Camera.requestMicrophonePermissionsAsync();
      
      // console.log('Camera permission:', cameraPermission.granted);
      // console.log('Audio permission:', audioPermission.granted);
      
      if (!cameraPermission.granted || !audioPermission.granted) {
        console.log('Permissions not granted');
        showMessage({
          message: 'Camera and microphone permissions are required for video calls',
          type: 'warning',
        });
        return false;
      }
      return true;
    } catch (error) {
      console.log('Permission error:', error);
      return false;
    }
  };

  const setupEventHandler = useCallback(() => {
    eventHandler.current = {
      onJoinChannelSuccess: (...args) => {
        console.log('onJoinChannelSuccess', ...args);
        setIsJoined(true);
      },
      onUserJoined: (_connection: RtcConnection, uid: number) => {
        setRemoteUid(uid);
      },
      onUserOffline: (_connection: RtcConnection, uid: number) => {
        setRemoteUid(uid);
      },
      onError: err => {
        console.log('Agora Error:', err);
      },
    };

    console.log('registering handler...');
    agoraEngineRef.current?.registerEventHandler({
      onJoinChannelSuccess: (...args) => {
        console.log('Agora Success:');

        setIsJoined(true);
      },
      onUserJoined: (_connection: RtcConnection, uid: number) => {
        setRemoteUid(uid);
      },
      onUserOffline: (_connection: RtcConnection, uid: number) => {
        setRemoteUid(uid);
      },
      onError: err => {
        console.log('Agora Error:', err);
      },
    });
    setTriggerJoin(true);
  }, []);

  const setupVideoSDKEngine = useCallback(async () => {
    try {
      const permissions = await getPermission();
      
      console.log('setting up engine...');
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      console.log('initializing engine...');
      await agoraEngine.initialize({ appId: appId });
      console.log('initialized engine...');
      console.log('enabling video and starting preview...');
      agoraEngine.enableVideo();
      agoraEngine.startPreview();
      console.log('enabled video and started preview...');
    } catch (e) {
      console.error('Setup error:', e);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      const init = async () => {
        await loadVideoToken();
        await setupVideoSDKEngine();
        setupEventHandler();
      };
      init();
    }
    return () => {
      if (isVisible) {
        cleanupAgoraEngine();
      }
    };
  }, [isVisible]);

  const join = useCallback(async () => {
    if (!videoToken) {
      console.log('No video token available');
      return;
    }
    if (isJoined) {
      console.log('Already joined');
      return;
    }
    if (!agoraEngineRef.current) {
      console.log('Engine not initialized');
      return;
    }
    try {
      console.log('joining channel...');
      if (isHost) {
        console.log('as host...');
        console.log('JOIN DEBUG:', { videoToken, channelName, localUid });
        agoraEngineRef.current?.joinChannel(videoToken, channelName, localUid, {
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          publishMicrophoneTrack: true,
          publishCameraTrack: true,
          autoSubscribeAudio: true,
          autoSubscribeVideo: true,
          token: videoToken,
        });
        agoraEngineRef.current?.enableLocalVideo(true);
        agoraEngineRef.current?.enableLocalAudio(true);
        console.log('joined...');
      } else {
        console.log('as non host...');
        console.log('JOIN DEBUG:', { videoToken, channelName, localUid });
        await agoraEngineRef.current?.joinChannel(videoToken, channelName, localUid, {
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          clientRoleType: ClientRoleType.ClientRoleAudience,
          publishMicrophoneTrack: false,
          publishCameraTrack: false,
          autoSubscribeAudio: true,
          autoSubscribeVideo: true,
        });
        console.log('joined...');
      }
    } catch (e) {
      console.log('Join error:', e);
    }
  }, [channelName, isHost, isJoined, localUid, videoToken]);

  const leave = useCallback(() => {
    try {
      console.log('leaving...');
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      closeModal && closeModal();
      console.log('left...');
    } catch (e) {
      console.log(e);
    }
  }, [closeModal]);

  const cleanupAgoraEngine = () => {
    console.log('cleaning engine...');
    agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
    agoraEngineRef.current?.release();
    console.log('cleaned engine...');
  };

  useEffect(() => {
    if (videoToken && triggerJoin) {
      setTriggerJoin(false);
      join();
    }
  }, [triggerJoin, join, videoToken]);



  return (
    <Modal style={{ margin: 0 }} isVisible={isVisible}>
      <Box flex={1} backgroundColor="faded">
        <SafeAreaView
          style={{
            flex: 1,
          }}>
          <Box
            flex={1}
            backgroundColor="faded"
            position="relative"
            justifyContent="center">
            <Box flex={1}>
              {isJoined && remoteUid !== 0 ? (
                <React.Fragment key={remoteUid}>
                  <RtcSurfaceView
                    canvas={{
                      uid: remoteUid,
                      sourceType: VideoSourceType.VideoSourceCamera,
                    }}
                    style={{
                      height: '100%',
                      width: '100%',
                    }}
                  />
                </React.Fragment>
              ) : (
                <Box paddingTop="l">
                  <Text textAlign="center">
                    {isJoined && !isHost
                      ? 'Call from ' + otherUser?.fullName
                      : 'Call with ' + otherUser?.fullName}
                  </Text>
                </Box>
              )}
            </Box>

            <Box position="absolute" bottom={60} left={0} width="100%">
              <Box
                flexDirection="row"
                justifyContent="flex-end"
                marginBottom="l"
                paddingHorizontal="l">
                {isVisible && (
                  <Box
                    width={125}
                    height={188}
                    borderRadius={8}
                    overflow="hidden"
                    backgroundColor="placeholder">
                    <RtcSurfaceView
                      canvas={{
                        uid: localUid,
                        sourceType: VideoSourceType.VideoSourceCamera,
                      }}
                      style={{
                        height: '100%',
                        width: '100%',
                      }}
                    />
                  </Box>
                )}
              </Box>
              <Box paddingHorizontal="l">
                <Box
                  flexDirection="row"
                  borderRadius={100}
                  justifyContent="space-between"
                  backgroundColor="minute_black"
                  paddingHorizontal="l"
                  paddingVertical="mid"
                  alignItems="center">
                  <Box>
                    <TouchableOpacity onPress={toggleMic}>
                      <Box
                        height={40}
                        width={40}
                        justifyContent="center"
                        alignItems="center"
                        borderRadius={40}
                        backgroundColor={isMicMuted ? 'label' : 'white'}
                        overflow="hidden">
                        <MicSVG size={24} color="#000" />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                  <Box>
                    <TouchableOpacity onPress={toggleCamera}>
                      <Box
                        height={40}
                        width={40}
                        justifyContent="center"
                        alignItems="center"
                        borderRadius={40}
                        overflow="hidden"
                        backgroundColor="white">
                        <VideoSVG size={24} color="#000" />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                  {!isHost && !isJoined && (
                    <Box>
                      <TouchableOpacity onPress={join}>
                        <Box
                          height={40}
                          width={40}
                          justifyContent="center"
                          alignItems="center"
                          borderRadius={40}
                          overflow="hidden"
                          backgroundColor="success">
                          <PhoneSVG size={24} color="#FFF" />
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  )}
                  <Box>
                    <TouchableOpacity onPress={leave}>
                      <Box
                        height={40}
                        width={40}
                        justifyContent="center"
                        alignItems="center"
                        borderRadius={40}
                        overflow="hidden"
                        backgroundColor="danger">
                        <PhoneSVG size={24} color="#FFF" />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </Modal>
  );
};

export default AgoraCallModal;
