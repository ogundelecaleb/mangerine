import {
  ActivityIndicator,
  Share,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useRef, useState } from 'react';
import Box from '@/components/Box';
import Modal from './Modal';
import Text from './Text';
import { Image } from 'expo-image';
import { addAlpha } from '@/utils/helpers';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActionSheetRef } from 'react-native-actions-sheet';
import BottomSheet from './BottomSheet';
import { useThemeColors } from '@/hooks/useTheme';
import Feather from 'react-native-vector-icons/Feather';
import Button from './Button';
import { showMessage } from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';
import useEdges from '@/hooks/useEdges';

interface Props {
  isVisible?: boolean;
  media?: string;
  closeModal?: () => void;
  onReport?: () => void;
}

const ViewImageModal = ({ isVisible, media, closeModal, onReport }: Props) => {
  const optionsRef = useRef<ActionSheetRef>(null);
  const { label, foreground_primary } = useThemeColors();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const flashRef = useRef<FlashMessage>(null);

  const downloadFile = useCallback(async () => {
    try {
      setDownloadLoading(true);
      
      // Simple share functionality as fallback
      await Share.share({
        url: media!,
        message: media!,
        title: 'Save Image',
      });
      
      setDownloadLoading(false);
      flashRef.current?.showMessage({
        message: 'Image shared - you can save it from your share options',
        type: 'success',
      });
    } catch (error) {
      console.log('share error:', error);
      setDownloadLoading(false);
      flashRef.current?.showMessage({
        message: 'Error sharing image',
        type: 'danger',
      });
    }
  }, [media]);

  const edges = useEdges();

  return (
    <Modal
      flashRef={flashRef}
      onBackButtonPress={closeModal}
      isVisible={isVisible}
      style={{ margin: 0 }}>
      <Box flex={1}>
        <TouchableWithoutFeedback
          onLongPress={() => optionsRef.current?.show()}
          style={{ flex: 1 }}>
          <Box flex={1} backgroundColor="black">
            <SafeAreaView edges={edges} style={{ flex: 1 }}>
              <Box flex={1}>
                <Box paddingVertical="mid" paddingHorizontal="l">
                  <TouchableOpacity onPress={closeModal}>
                    <Box
                      height={40}
                      width={40}
                      marginTop="xl"
                      borderRadius={8}
                      justifyContent="center"
                      alignItems="center"
                      style={{ backgroundColor: addAlpha('#000000', 0.4) }}>
                      <MaterialCommunityIcons
                        name="close"
                        size={24}
                        color="#FFFFFF"
                      />
                    </Box>
                  </TouchableOpacity>
                </Box>
                <Box flex={1} justifyContent="center">
                  <Box flex={1}>
                    {media && (
                      <Image
                        contentFit="contain"
                        style={{ height: '100%', width: '100%' }}
                        source={{
                          uri: media,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </SafeAreaView>
            <BottomSheet backgroundColor="background" ref={optionsRef}>
              <Box paddingVertical="l" gap="m">
                <TouchableOpacity onPress={downloadFile}>
                  <Box
                    flexDirection="row"
                    paddingBottom="m"
                    borderBottomColor="label"
                    borderBottomWidth={1}>
                    <Box flex={1}>
                      <Text>Share to Save</Text>
                    </Box>
                    <Box>
                      {downloadLoading ? (
                        <ActivityIndicator
                          size="small"
                          color={foreground_primary}
                        />
                      ) : (
                        <Feather name="download" size={24} color={label} />
                      )}
                    </Box>
                  </Box>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    optionsRef.current?.hide();
                    setTimeout(() => {
                      Share.share({
                        url: media!,
                        message: media!,
                        title: media!,
                      });
                    }, 900);
                  }}>
                  <Box
                    flexDirection="row"
                    paddingBottom="m"
                    borderBottomColor="label"
                    borderBottomWidth={1}>
                    <Box flex={1}>
                      <Text>Share Image</Text>
                    </Box>
                    <Box>
                      <Feather name="share-2" size={24} color={label} />
                    </Box>
                  </Box>
                </TouchableOpacity>
                {onReport && (
                  <TouchableOpacity
                    onPress={() => {
                      onReport && onReport();
                      optionsRef.current?.hide();
                    }}>
                    <Box flexDirection="row" paddingBottom="m">
                      <Box flex={1}>
                        <Text>Report Image</Text>
                      </Box>
                      <Box>
                        <Feather name="flag" size={24} color={label} />
                      </Box>
                    </Box>
                  </TouchableOpacity>
                )}
                <Box>
                  <Button
                    displayText="Close"
                    onPress={() => optionsRef.current?.hide()}
                  />
                </Box>
              </Box>
            </BottomSheet>
          </Box>
        </TouchableWithoutFeedback>
      </Box>
    </Modal>
  );
};

export default ViewImageModal;
