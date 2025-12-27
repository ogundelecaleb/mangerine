import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Post {
  id: string;
  title: string;
  content: string;
  author: any;
}

interface Work {
  id: string;
  title: string;
  description: string;
  url?: string;
}

interface PostsState {
  allPosts: Post[];
  userPosts: Post[];
  userWorks: Work[];
}

const initialState: PostsState = {
  allPosts: [],
  userPosts: [],
  userWorks: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setAllPosts: (state, action: PayloadAction<{ posts: Post[] }>) => {
      state.allPosts = action.payload.posts;
    },
    setUserPosts: (state, action: PayloadAction<{ posts: Post[] }>) => {
      state.userPosts = action.payload.posts;
    },
    setUserWorks: (state, action: PayloadAction<{ works: Work[] }>) => {
      state.userWorks = action.payload.works;
    },
  },
});

export const { setAllPosts, setUserPosts, setUserWorks } = postsSlice.actions;

export const selectPostsValues = (state: { posts: PostsState }) => state.posts;

export default postsSlice.reducer;