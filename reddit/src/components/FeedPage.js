import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { baseURL } from './constants';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import useForm from './useForm';

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
});

const FeedPage = (props) => {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const onVoteAdd = (postsId) => {
    const body = {
      "direction": 1
    }
    axios.post(`https://us-central1-labenu-apis.cloudfunctions.net/labEddit/posts/${postsId}/vote`,body)
    .then(() => {
        console.log("+1")
    })
    .catch(() => {
        alert("Erro ao votar.")
    })
}

const onVoteDecrease = (postsId) => {
  const body = {
    "direction": -1
  }
  axios.post(`https://us-central1-labenu-apis.cloudfunctions.net/labEddit/posts/${postsId}/vote`,body)
  .then(() => {
      console.log("-1")
  })
  .catch(() => {
      alert("Erro ao votar.")
  })
}
console.log(posts.id)

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      history.push('/');
    }
  });

  useEffect(() => {
    getListPost()
  }, []);

  const getListPost = () => {
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

  }

  const classes = useStyles(); 

  const { form, onChange, resetForm } = useForm({
    text:'',
    title: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    onChange(name, value);
  };

  const handlePost = event => {
    event.preventDefault();
    const token = window.localStorage.getItem("token")
    const body = {
      "text": form.text,
	    "title": form.title
    }
    axios.post(`https://us-central1-labenu-apis.cloudfunctions.net/labEddit/posts`,body,{headers: {
      Authorization: token
    }}).then(() => {
        alert("Post criado com sucesso!")
        getListPost()
        resetForm()
    }).catch(() => {
      alert("Erro ao criar post.")
    })
  };

  return (
    <Card className={classes.root}>
      {isLoading && <CircularProgress />}
      
        
        <CardContent>
        <form onSubmit={handlePost}>
          <input placeholder="Título do Post" name="title" onChange={handleInputChange}/>
          <input placeholder="Escreva seu Post" name="text" onChange={handleInputChange}/>
          <button>Postar</button>
        </form>
        
        {posts.map((post) => {
        return (
          <div key={post.id}>
            <CardActionArea>
          <Typography gutterBottom variant="h5" component="h2">
            {post.username}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          <p>{post.text}</p>
          </Typography>
          </CardActionArea>
          <CardActions>
        <Button size="small" color="primary" onClick={() => onVoteDecrease(post.id)}>
        -
        </Button>
        <p>{post.votesCount}</p>
        <Button size="small" color="primary" onClick={() => onVoteAdd(post.id)}>
        +
        </Button>
        <p>{post.commentsCount}</p>
        <Button size="small" color="primary">
          Comentários
        </Button>
      </CardActions>
      <hr/>


        </div>
        )
      })}
          
        </CardContent>
      
      
    </Card>
  );
}

export default FeedPage;