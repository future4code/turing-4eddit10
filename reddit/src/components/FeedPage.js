import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { baseURL } from './constants';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

const FeedPage = (props) => {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      history.push('/login');
    }
  });

  useEffect(() => {
    const axiosConfig = {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    };

    setIsLoading(true);
    axios.get(`${baseURL}/posts`, axiosConfig).then((response) => {
      console.log(response.data.posts);
      setPosts(response.data.posts);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      {isLoading && <CircularProgress />}

      {posts.map((post) => {
        return <li>{post.text}</li>;
      })}
    </div>
  );
};

export default FeedPage;
