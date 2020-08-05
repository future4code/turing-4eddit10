import React, {useState, useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components'
import useForm from './useForm';
import { EatLoading } from 'react-loadingg';

const DivVoteComments = styled.div`
    display: flex;
    justify-content: space-evenly;
`

const InputComment = styled.input`
    width: 470px;
    height: 100px;
    margin-top: 64px;
`

const FormComment = styled.form`
    display: flex;
    flex-direction: column;
`

const ButtonComment = styled.button`
    height: 35px;
`

const DivVote = styled.div`
    display: flex;
    justify-content: space-between;
    width: 70px;
`

const DivVoteToComment = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 20%;
    margin: 0 auto;
`

const DivContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

const DivPost = styled.div`
    border: 1px solid black;
    width: 25%;
    text-align: center;
    margin-top: 32px;
    margin-bottom: 32px;
`

function FeedDetailPage () {

    const [postDetail, setpostDetail] = useState([])
    const [comments, setComments] = useState([])

    const history = useHistory()
    const params = useParams()

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = window.localStorage.getItem("token")

        if(token === null){
            history.push("/login")
        }else{
            getPostDetail()
        }
    },[history])

    const getPostDetail = () => {
        const token = window.localStorage.getItem("token")
        setIsLoading(true);
        axios.get(`https://us-central1-labenu-apis.cloudfunctions.net/labEddit/posts/${params.postId}`, {headers:{
            Authorization: token
            }
        }).then( response => {
            setpostDetail(response.data.post)
            setComments(response.data.post.comments)
            setIsLoading(false);
        }).catch(error => {
            console.log(error.message)
        })
    }

    const { form, onChange, resetForm } = useForm({
        comment:''
      });
    
      const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        onChange(name, value);
      };

      const handleComment = event => {
        event.preventDefault();
        const token = window.localStorage.getItem("token")
        const body = {
          "text": form.comment
        }
        axios.post(`https://us-central1-labenu-apis.cloudfunctions.net/labEddit/posts/${postDetail.id}/comment`,body,{headers: {
          Authorization: token
        }}).then(() => {
            alert("Comentário criado com sucesso!")
            resetForm()
            getPostDetail()
        }).catch(() => {
          alert("Erro ao criar comentário.")
        })
      };

      const putVotesComment = (postId, commentId, decision, userVoteDirection) => {
        const token = window.localStorage.getItem("token")
        let body = {};
        if (userVoteDirection === decision) {
          body = { direction: 0 };
        } else {
          body = { direction: decision};
        }
    
        axios.put(`https://us-central1-labenu-apis.cloudfunctions.net/labEddit/posts/${postId}/comment/${commentId}/vote`, body, {headers: {
        Authorization: token
      }}).then(() => {
            getPostDetail()
          })
          .catch((err) => {
            alert("Erro ao computar voto!")
          });
      };

    return(
        <DivContainer>
            {isLoading ? <EatLoading /> :
                <DivContainer>
                    <DivPost>
                        <p><strong>{postDetail.username}</strong></p>
                        <hr/>
                        <p>{postDetail.text}</p>
                        <hr/>
                        <DivVoteComments>
                            <DivVote>
                                <button>-</button>
                                <p>{postDetail.votesCount}</p>
                                <button>+</button>
                            </DivVote>
                            <p>{postDetail.commentsCount} {postDetail.commentsCount <= 1 ? "Comentário" : "Comentários"}</p>
                        </DivVoteComments>
                    </DivPost>

                    <FormComment onSubmit={handleComment}>
                        <InputComment placeholder="Escreva seu comentário" value={form.comment} name="comment" onChange={handleInputChange}/>
                        <ButtonComment>Comentar</ButtonComment>
                    </FormComment>

                    {comments.map(comment => {
                        return(
                            <DivPost key={comment.id}>
                                <p>{comment.username}</p>
                                <hr/>
                                <p>{comment.text}</p>
                                <hr/>
                                <DivVoteToComment>
                                    <button onClick={() => putVotesComment(postDetail.id, comment.id, -1, comment.userVoteDirection)}>-</button>
                                    <p>{comment.votesCount}</p>
                                    <button onClick={() => putVotesComment(postDetail.id, comment.id, 1, comment.userVoteDirection)}>+</button>
                                </DivVoteToComment>
                            </DivPost>
                        )
                    })}
                </DivContainer>
            }
        </DivContainer>
    )
}

export default FeedDetailPage