import { Share, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import { truncate } from 'lodash';

import Box from './Box';
import Text from './Text';
import ScaledImage from './ScaledImage';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../utils/theme';
import { MainStack } from '../utils/ParamList';
import { useAppSelector } from '../state/hooks/redux';
import { useLikePostMutation, useSharePostMutation, useDeletePostMutation } from '../state/services/posts.service';

interface Post {
  id: string;
  content: string;
  createdAt: string;
  images?: string[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  likes: Array<{ id: string; fullName: string; profilePics?: string; followerCount?: number }>;
  creator: {
    id: string;
    fullName: string;
    profilePics?: string;
  };
}

interface Props {
  post: Post;
  fullDetails?: boolean;
  profile?: boolean;
  postDelete?: () => void;
}

const PostItem = ({ post, fullDetails, profile, postDelete }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStack, any>>();
  const theme = useTheme<Theme>();
  const [viewMore, setViewMore] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const user = useAppSelector(state => state.auth.user);
  const [like] = useLikePostMutation();
  const [removePost, { isLoading: removeLoading }] = useDeletePostMutation();
  const [share] = useSharePostMutation();
  const [liked, setLiked] = useState(false);
  const [unliked, setUnLiked] = useState(false);

  const likedStatus =
    ((post?.likes || []).find(l => l.id === user?.id) && !unliked) || liked;

  const likePost = useCallback(async () => {
    const wasUnliked = unliked;
    try {
      if (wasUnliked) {
        setUnLiked(false);
      } else {
        setLiked(true);
      }
      const response = await like({
        body: {
          postId: post?.id,
          userId: user?.id!,
        },
      });
      
      if (response?.error) {
        if (wasUnliked) {
          setUnLiked(true);
        } else {
          setLiked(false);
        }
        const err = response as any;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
    } catch (error) {
      if (wasUnliked) {
        setUnLiked(true);
      } else {
        setLiked(false);
      }
    }
  }, [like, post?.id, unliked, user?.id]);

  const deletePost = useCallback(async () => {
    try {
      const response = await removePost({
        id: post?.id,
      });
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      
      showMessage({
        message: 'Post deleted successfully',
        type: 'success',
      });
      
      setTimeout(() => {
        postDelete && postDelete();
      }, 500);
    } catch (error) {
      console.log('delete post error:', error);
    }
  }, [removePost, post?.id, postDelete]);

  const sharePost = useCallback(async () => {
    try {
      const response = await share({
        id: post?.id,
      });
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      
      const shareBase = `https://app.mangerine.com/posts/${post?.id}`;
      Share.share({
        message: `View this post on mangerine ${shareBase}`,
        title: 'View on mangerine',
        url: shareBase,
      });
    } catch (error) {
      console.log('share post error:', error);
    }
  }, [post?.id, share]);

  return (
    <Box
      borderWidth={1}
      paddingBottom="s"
      borderRadius={8}
      borderColor="border">
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('PostDetails', { post });
        }}>
        <Box padding="s" style={{ paddingBottom: 0 }}>
          <Box
            flexDirection="row"
            marginBottom="m"
            justifyContent="space-between"
            gap="l"
            alignItems="center">
            <Box flex={1} flexDirection="row" alignItems="center" gap="s">
              <Box>
                <Box
                  height={32}
                  width={32}
                  borderRadius={32}
                  overflow="hidden"
                  backgroundColor="faded"
                  justifyContent="center"
                  alignItems="center">
                  <Text variant="bold" fontSize={14}>
                    {post?.creator?.fullName?.charAt(0) || 'U'}
                  </Text>
                </Box>
              </Box>
              <Box>
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Text fontSize={16}>{post?.creator?.fullName}</Text>
                </Box>
                <Box>
                  <Text color="label">
                    {moment(post?.createdAt).fromNow()}
                  </Text>
                </Box>
              </Box>
            </Box>
            {!fullDetails && user?.id === post?.creator?.id && (
              <TouchableOpacity onPress={deletePost}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={20}
                  color={theme.colors.danger}
                />
              </TouchableOpacity>
            )}
          </Box>
          <Box gap="s">
            <Box>
              {fullDetails ? (
                <Text>{post?.content}</Text>
              ) : (
                <Text
                  onTextLayout={e => {
                    if (e.nativeEvent.lines.length > 4) {
                      setViewMore(true);
                    }
                  }}>
                  {viewMore
                    ? truncate(post?.content, {
                        length: 100,
                      })
                    : post?.content}
                  {viewMore && (
                    <Text
                      variant="semibold"
                      color="foreground_primary">
                      View more
                    </Text>
                  )}
                </Text>
              )}
            </Box>
            {post?.images?.length > 0 && (
              <Box
                flexDirection="row"
                gap="s"
                borderRadius={6}
                overflow="hidden">
                {post.images.map(imageUri => (
                  <Box
                    flex={1}
                    height={150}
                    borderRadius={6}
                    overflow="hidden"
                    key={imageUri}>
                    <ScaledImage
                      uri={imageUri}
                      width={150}
                      height={150}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box
            marginTop="s"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <TouchableOpacity onPress={likePost}>
              <Box flexDirection="row" alignItems="center" gap="xs">
                <MaterialCommunityIcons
                  name={likedStatus ? 'thumb-up' : 'thumb-up-outline'}
                  size={18}
                  color={theme.colors.label}
                />
                <Text>
                  {liked && likedStatus
                    ? post?.likeCount + 1
                    : unliked && !likedStatus
                    ? post?.likeCount - 1
                    : post?.likeCount}
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PostDetails', {
                  post: {
                    ...post,
                    likes: liked
                      ? [
                          ...post.likes,
                          {
                            followerCount: user?.followerCount || 0,
                            fullName: user?.fullName || '',
                            id: user?.id || '',
                            profilePics: user?.profilePics || '',
                          },
                        ]
                      : unliked
                      ? post.likes.filter(l => l.id !== user?.id)
                      : post.likes,
                  },
                });
              }}>
              <Box flexDirection="row" alignItems="center" gap="xs">
                <MaterialCommunityIcons
                  name="message-text-outline"
                  size={18}
                  color={theme.colors.label}
                />
                <Text>{post?.commentCount}</Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity>
              <Box flexDirection="row" alignItems="center" gap="xs">
                <MaterialCommunityIcons
                  name="eye-outline"
                  size={18}
                  color={theme.colors.label}
                />
                <Text>{post?.viewCount || 0}</Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={sharePost}>
              <Box flexDirection="row" alignItems="center" gap="xs">
                <MaterialCommunityIcons
                  name="share-variant-outline"
                  size={18}
                  color={theme.colors.label}
                />
                <Text>{post?.shareCount}</Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default PostItem;