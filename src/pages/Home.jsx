import React, {useState, useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAuth, fetchRegister, selectIsAuth } from "../redux/slices/auth";
import { Navigate } from 'react-router-dom';


import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

import Pagination from '@mui/material/Pagination'; 


export const Home = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === 'loading';

  const isTagsLoading = tags.status === 'loading';
  

  const [currentPage, setCurrentPage] = useState(1); // Состояние для текущей страницы
  const postsPerPage = 5; // Количество постов на одной странице




  React.useEffect(() => { 
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);//сюда диспатч сунул чтобы предупреждение убрать, вынуть его в конце всего

//если не авторизован - возвращаем бориса на страницу реги
  if (!isAuth) {
    return<Navigate to="/register" />
  }


  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.items.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };



  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
               <Post key={index} isLoading={true} />  
              ) : (
                <Post
                  id={obj._id}
                  title={obj.title}
                  imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={3}
                  tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}
                />
              ),
            )}
            <Pagination
            count={Math.ceil(posts.items.length / postsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}
          />
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items || []} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'Второй тестовый комментарий',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
