import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { getArticleList, getArticle } from '../service/API'

export const getSingleArticle = createAsyncThunk(
  'articles/getSingleArticle',
  async ({ slug, token }, { rejectWithValue }) => {
    try {
      const singleArticle = await getArticle(slug, token)
      return singleArticle
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const getArticles = createAsyncThunk('articles/getArticles', async ({ offset, token }, { rejectWithValue }) => {
  try {
    const articleList = await getArticleList(offset, token)
    return articleList
  } catch (err) {
    return rejectWithValue(err)
  }
})

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    totalCount: 0,
    offset: 0,
    currentPage: 1,
    load: false,
    listArticles: {
      array: [],
      error: null,
    },
    singleArticle: {
      object: null,
      error: null,
      status: false,
    },
  },
  reducers: {
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload.currentPage
      const newOffset = payload.currentPage * 5 - 5
      state.offset = newOffset
    },
    clearSingle: (state) => {
      state.singleArticle.object = null
      state.singleArticle.status = false
      state.load = false
      state.singleArticle.error = null
    },
  },
  extraReducers: {
    [getArticles.pending]: (state) => {
      state.load = true
    },
    [getArticles.rejected]: (state, { payload }) => {
      state.listArticles.error = payload
      state.load = false
    },
    [getArticles.fulfilled]: (state, { payload }) => {
      state.listArticles.array = payload.articles
      state.totalCount = payload.articlesCount
      state.load = false
    },
    [getSingleArticle.pending]: (state) => {
      state.load = true
    },
    [getSingleArticle.rejected]: (state, { payload }) => {
      state.singleArticle.error = payload
      state.load = false
    },
    [getSingleArticle.fulfilled]: (state, { payload }) => {
      state.load = false
      state.singleArticle.object = payload.article
      state.singleArticle.status = true
    },
  },
})

export const { setCurrentPage, clearSingle } = articlesSlice.actions

export default articlesSlice.reducer
