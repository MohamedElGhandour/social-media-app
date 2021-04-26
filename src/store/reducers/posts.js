import * as actionTypes from "../actions/actionTypes";
import cloneDeep from "lodash/cloneDeep";
import defoultProfilePic from "../../assets/images/avatar.png";

const initialState = { posts: [], error: null, users: [] };

const successFetchPosts = (state, action) => {
  const newPosts = cloneDeep(action.posts);
  newPosts.forEach((post) => {
    const userPost = state.users[post.userId - 1];
    post.avatar = userPost.avatar;
    post.author = userPost.name;
    post.comments.forEach((comment) => {
      const userComment = state.users[comment.userId - 1];
      comment.avatar = userComment.avatar;
      comment.author = userComment.name;
    });
  });
  return { ...state, posts: newPosts };
};
const failedFetchPosts = (state, action) => {
  return { ...state, error: action.error };
};

const successSendNewPost = (state, action) => {
  const newArr = cloneDeep(state.posts);
  const name = localStorage.getItem("name");
  const avatar = localStorage.getItem("avatar");
  const addCommentsToPost = {
    ...action.data,
    author: name,
    avatar: avatar,
    comments: [],
  };
  newArr.unshift(addCommentsToPost);
  return { ...state, posts: newArr };
};

const successAddComment = (state, action) => {
  const newState = cloneDeep(state);
  const newComment = cloneDeep(action.comment);
  const name = localStorage.getItem("name");
  const avatar = localStorage.getItem("avatar");
  newComment.author = name;
  newComment.avatar = avatar;
  newState.posts.forEach((post) => {
    if (action.data.id === post.id) {
      post.comments.push(newComment);
    }
  });
  return { ...newState };
};

const successFetchUsers = (state, action) => {
  const users = cloneDeep(action.data);
  const avatar = defoultProfilePic;
  users.forEach((user) => {
    !user.avatar && (user.avatar = avatar);
  });
  return { ...state, users: users };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUCCESS_FETCH_POSTS:
      return successFetchPosts(state, action);
    case actionTypes.FAILED_FETCH_POSTS:
      return failedFetchPosts(state, action);
    case actionTypes.SUCCESS_SEND_NEW_POST:
      return successSendNewPost(state, action);
    case actionTypes.SUCCESS_ADD_COMMENT:
      return successAddComment(state, action);
    case actionTypes.SUCCESS_FETCH_USERS:
      return successFetchUsers(state, action);
    default:
      return state;
  }
};
export default reducer;
