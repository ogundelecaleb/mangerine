import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { orderBy } from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Box from '../../components/Box';
import Text from '../../components/Text';
import BaseScreenComponent from '../../components/BaseScreenComponent';
import BottomTabHeader from '../../components/BottomTabHeader';
import PostItem from '../../components/PostItem';
import EmptyState from '../../components/EmptyState';
import { BottomTabList, MainStack } from '../../utils/ParamList';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../utils/theme';
import { usePaginatedPostsMutation } from '../../state/services/posts.service';

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

interface Props extends BottomTabScreenProps<BottomTabList, 'Home'> {}

const HomeScreen = ({}: Props) => {
  const mainNavigation = useNavigation<NativeStackNavigationProp<MainStack, 'Tabs'>>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const theme = useTheme<Theme>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [getPosts, { isLoading }] = usePaginatedPostsMutation();
  const limit = 50;
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');

  const loadPaginated = useCallback(async () => {
    try {
      const response = await getPosts({
        params: {
          limit,
          page,
        },
      });
      
      if ((response as any)?.error) {
        return;
      }
      
      setTotalPages((response as any)?.data?.data?.totalPages || 1);
      if (page === 1) {
        setLocalPosts((response as any)?.data?.data?.items || []);
      } else {
        setLocalPosts(x => [
          ...x,
          ...((response as any)?.data?.data?.items || []),
        ]);
      }
    } catch (error) {
      console.log('paginated posts error', JSON.stringify(error));
    }
  }, [getPosts, page]);

  const orderedPosts = useMemo(
    () =>
      orderBy(
        localPosts?.filter(
          p =>
            p?.content?.toLowerCase()?.includes(search?.toLowerCase()) ||
            p?.creator?.fullName
              ?.toLowerCase()
              ?.includes(search?.toLowerCase()),
        ),
        ['createdAt'],
        'desc',
      ),
    [localPosts, search],
  );

  useEffect(() => {
    if (!isLoading) {
      setIsRefreshing(false);
    }
  }, [isLoading]);

  useEffect(() => {
    loadPaginated();
  }, [loadPaginated]);

  useFocusEffect(
    useCallback(() => {
      loadPaginated();
    }, [loadPaginated]),
  );

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <Box flex={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={20}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
              <Box flex={1} position="relative">
                <BottomTabHeader
                  searchValue={search}
                  setSearchValue={setSearch}
                />
                <Box flex={1} onStartShouldSetResponder={() => true}>
                  {isLoading && orderedPosts.length < 1 && (
                    <Box alignItems="center" padding="l">
                      <ActivityIndicator
                        size="small"
                        color={theme.colors.foreground_primary}
                      />
                    </Box>
                  )}
                  <FlatList
                    onEndReachedThreshold={0.3}
                    onEndReached={() => {
                      if (!isLoading && page < totalPages) {
                        setPage(page + 1);
                      }
                    }}
                    refreshing={isRefreshing && isLoading}
                    refreshControl={
                      <RefreshControl
                        refreshing={isRefreshing && isLoading}
                        onRefresh={() => {
                          if (page === 1) {
                            loadPaginated();
                          } else {
                            setPage(1);
                          }
                          setIsRefreshing(true);
                        }}
                      />
                    }
                    data={orderedPosts}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      gap: 16,
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                    }}
                    ListEmptyComponent={
                      <Box>
                        <EmptyState
                          title="No posts here yet"
                          actionText="Create Post"
                          onAction={() =>
                            mainNavigation.navigate('CreatePost')
                          }
                        />
                      </Box>
                    }
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => (
                      <PostItem
                        post={item}
                        postDelete={() => {
                          if (page === 1) {
                            loadPaginated();
                          } else {
                            setPage(1);
                          }
                          setIsRefreshing(true);
                        }}
                      />
                    )}
                  />
                </Box>
                <Box position="absolute" bottom={20} right={30}>
                  <TouchableOpacity
                    onPress={() => mainNavigation.navigate('CreatePost')}>
                    <Box
                      paddingHorizontal="m"
                      height={50}
                      borderRadius={100}
                      backgroundColor="primary"
                      alignItems="center"
                      flexDirection="row"
                      gap="s">
                      <MaterialCommunityIcons
                        name="plus"
                        size={24}
                        color="#FFFFFF"
                      />
                      <Text variant="bold" fontSize={12} color="white">
                        Create Post
                      </Text>
                    </Box>
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

export default HomeScreen;