import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from '../../axios';



export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    // const { data } = await axios.get(`/posts?page=${page}&limit=${limit}`);
    const { data } = await axios.get('/posts');
    return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags');
    return data;
});

export const fetchRemovePost= createAsyncThunk('posts/fetchRemovePost', async (id) => 
    axios.delete(`/posts/${id}`)
);



const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'idle',
    },
};

//состояния запроса
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: {
        //Получаем статьи
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded';
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },

        //Получаем теги
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'gotov';
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },

        //Удаляем статьи
        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);//
        },/* 
        [fetchRemovePost.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'gotov';
        }, */
        /* [fetchRemovePost.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        }, */
    },
});

export const postsReducer = postsSlice.reducer;