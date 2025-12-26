import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { showMessage } from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { orderBy } from 'lodash';
import moment from 'moment';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import PostItem from '../../components/PostItem';
import EmptyState from '../../components/EmptyState';
import { MainStack } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { useAppSelector } from '../../state/hooks/redux';
import {
  useGetPostMutation,
  useGetCommentsMutation,
  usePostCommentMutation,
  useDeletePostMutation,
  useViewPostMutation,
} from '../../state/services/posts.service';

interface Comment {
  id: string;
  comment: string;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    profilePics?: string;
  };
  likeCount: number;
  commentCount: number;
}

type Props = NativeStackScreenProps<MainStack, 'PostDetails'>;

const PostDetailsScreen = ({ navigation, route }: Props) => {
  const { post: initialPost } = route.params;
  const theme = useTheme<Theme>();
  const user = useAppSelector(state => state.auth.user);
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const commentInputRef = useRef<TextInput>(null);
  
  const [getPost, { isLoading: postLoading }] = useGetPostMutation();
  const [getComments, { isLoading: commentsLoading }] = useGetCommentsMutation();
  const [postComment, { isLoading: postCommentLoading }] = usePostCommentMutation();
  const [deletePost, { isLoading: deleteLoading }] = useDeletePostMutation();
  const [viewPost] = useViewPostMutation();

  const orderedComments = useMemo(
    () => orderBy(comments, ['createdAt'], 'desc'),
    [comments]
  );

  const fetchPost = useCallback(async () => {
    try {
      const response = await getPost({ id: post.id });
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message: err?.error?.data?.message || 'Failed to load post',
          type: 'danger',
        });
        return;
      }
      
      // Increment view count
      await viewPost({ id: post.id });
      
      setPost(prev => ({
        ...prev,
        ...(response as any)?.data?.data,
      }));
    } catch (error) {
      console.log('fetch post error:', error);
    }
  }, [getPost, viewPost, post.id]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await getComments({
        params: {
          postId: post.id,
          page: 1,
          order: 'DESC',
          take: 50,
        },
      });
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message: err?.error?.data?.message || 'Failed to load comments',
          type: 'danger',
        });
        return;
      }
      
      const responseData = (response as any)?.data;
      setComments(responseData?.data || []);
    } catch (error) {
      console.log('fetch comments error:', error);
    }
  }, [getComments, post.id]);

  const addComment = useCallback(async () => {
    try {
      if (!comment.trim()) return;
      
      const response = await postComment({
        body: {
          comment: comment.trim(),
          postId: post.id,
          userId: user?.id!,
        },
      });
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message: err?.error?.data?.message || 'Failed to add comment',
          type: 'danger',
        });
        return;
      }
      
      setComment('');
      Keyboard.dismiss();
      
      // Refresh comments and post data
      fetchComments();
      fetchPost();
      
      showMessage({
        message: 'Comment added successfully',
        type: 'success',
      });
    } catch (error) {
      console.log('add comment error:', error);
    }
  }, [comment, postComment, post.id, user?.id, fetchComments, fetchPost]);

  const handleDeletePost = useCallback(async () => {
    try {
      const response = await deletePost({ id: post.id });
      
      if (response?.error) {
        const err = response as any;
        showMessage({
          message: err?.error?.data?.message || 'Failed to delete post',
          type: 'danger',
        });
        return;
      }
      
      showMessage({
        message: 'Post deleted successfully',
        type: 'success',
      });
      
      navigation.goBack();
    } catch (error) {
      console.log('delete post error:', error);
    }
  }, [deletePost, post.id, navigation]);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchPost(), fetchComments()]);
    setRefreshing(false);
  }, [fetchPost, fetchComments]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const renderCommentItem = useCallback(({ item }: { item: Comment }) => (
    <Box padding="m" borderBottomWidth={1} borderBottomColor="border">
      <Box flexDirection="row" alignItems="flex-start" gap="m">
        <Box
          height={32}
          width={32}
          borderRadius={16}
          backgroundColor="faded"
          justifyContent="center"
          alignItems="center">
          <Text variant="bold" fontSize={12}>
            {item.author.fullName.charAt(0)}
          </Text>
        </Box>
        
        <Box flex={1}>
          <Box flexDirection="row" alignItems="center" gap="s" marginBottom="xs">
            <Text variant="semibold" fontSize={14}>
              {item.author.fullName}
            </Text>
            <Text color="label" fontSize={12}>
              {moment(item.createdAt).fromNow()}
            </Text>
          </Box>
          
          <Text fontSize={14} marginBottom="s">
            {item.comment}
          </Text>
          
          <Box flexDirection="row" alignItems="center" gap="m">
            <Box flexDirection="row" alignItems="center" gap="xs">
              <MaterialCommunityIcons
                name="thumb-up-outline"
                size={16}
                color={theme.colors.label}
              />
              <Text fontSize={12} color="label">
                {item.likeCount}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ), [theme.colors.label]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box flex={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}>
              <Box flex={1}>
                {/* Header */}
                <Box
                  flexDirection="row"
                  alignItems="center"
                  paddingHorizontal="l"
                  paddingVertical="m"
                  gap="m">
                  <TouchableOpacity onPress={navigation.goBack}>
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={24}
                      color={theme.colors.foreground}
                    />
                  </TouchableOpacity>
                  
                  <Box flex={1} alignItems="center">
                    <Text variant="semibold" fontSize={18}>
                      Post
                    </Text>
                  </Box>
                  
                  {user?.id === post.creator.id && (
                    <TouchableOpacity onPress={handleDeletePost}>
                      {deleteLoading ? (
                        <ActivityIndicator size="small" color={theme.colors.danger} />
                      ) : (
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={20}
                          color={theme.colors.danger}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                </Box>

                {/* Content */}
                <Box flex={1}>
                  {postLoading ? (
                    <Box padding="l" alignItems="center">
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    </Box>
                  ) : (
                    <FlatList
                      data={orderedComments}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={renderCommentItem}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={refreshAll}
                        />
                      }
                      ListHeaderComponent={
                        <Box paddingHorizontal="l" marginBottom="m">
                          <PostItem
                            post={post}
                            fullDetails
                            postDelete={() => navigation.goBack()}
                          />
                        </Box>
                      }
                      ListEmptyComponent={
                        <Box paddingTop="xl" paddingHorizontal="l">
                          <EmptyState
                            title="No comments yet"
                            description="Be the first to comment on this post"
                            actionText="Add Comment"
                            onAction={() => commentInputRef.current?.focus()}
                          />
                        </Box>
                      }
                      showsVerticalScrollIndicator={false}
                    />
                  )}
                  
                  {commentsLoading && (
                    <Box padding="l" alignItems="center">
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    </Box>
                  )}
                </Box>

                {/* Comment Input */}
                <Box
                  backgroundColor="background"
                  flexDirection="row"
                  paddingHorizontal="l"
                  paddingVertical="m"
                  gap="m"
                  alignItems="center"
                  borderTopWidth={1}
                  borderTopColor="border">
                  <Box
                    height={32}
                    width={32}
                    borderRadius={16}
                    backgroundColor="faded"
                    justifyContent="center"
                    alignItems="center">
                    <Text variant="bold" fontSize={12}>
                      {user?.fullName?.charAt(0) || 'U'}
                    </Text>
                  </Box>
                  
                  <Box flex={1}>
                    <TextInput
                      ref={commentInputRef}
                      value={comment}
                      onChangeText={setComment}
                      placeholder="Add a comment..."
                      placeholderTextColor={theme.colors.label}
                      style={{
                        fontSize: 14,
                        color: theme.colors.foreground,
                        maxHeight: 100,
                      }}
                      multiline
                    />
                  </Box>
                  
                  <TouchableOpacity
                    onPress={addComment}
                    disabled={!comment.trim() || postCommentLoading}>
                    {postCommentLoading ? (
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : (
                      <MaterialCommunityIcons
                        name="send-outline"
                        size={20}
                        color={comment.trim() ? theme.colors.primary : theme.colors.label}
                      />
                    )}
                  </TouchableOpacity>
                </Box>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default PostDetailsScreen;