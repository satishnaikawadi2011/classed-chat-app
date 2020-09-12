import React, { useEffect, useState } from 'react';
import { Col,Form } from 'react-bootstrap';
import { useLazyQuery, gql,useMutation } from '@apollo/client';
import { useMessageState, useMessageDispatch } from '../context/message';
import Message from './Message';


const SEND_MESSAGE = gql`
	mutation sendMessage($to:String!,$content:String!){
		sendMessage(to:$to,content:$content){
			id
			from
			to
			createdAt content
		}
	}
`

const GET_MESSAGES = gql`
	query getMessages($from: String!) {
		getMessages(from: $from) {
			id
			from
			to
			content
			createdAt
		}
	}
`;

function Messages() {
	const [content, setContent] = useState('');
	const { users } = useMessageState();
    const dispatch = useMessageDispatch();
        const selectedUser = users?.find((user) => user.selected === true)
		const messages = selectedUser?.messages
		// console.log(messages,'messages');
	const submitMessage = (e) => {
		e.preventDefault();
		if(content.trim() === '' || !selectedUser) return;

		sendMessage({variables:{to:selectedUser.username,content}})
		setContent('')

	}
	const [
		getMessages,
		{ loading: messagesLoading, data: messagesData }
	] = useLazyQuery(GET_MESSAGES);

	const [sendMessage] = useMutation(SEND_MESSAGE,{
		onError(err){
			console.log(err);
		},
	})
	useEffect(
		() => {
			if (selectedUser && !selectedUser.messages) {
				getMessages({ variables: { from: selectedUser.username } });
			}
		},
		[
			selectedUser,getMessages
		]
    );
    
    useEffect(() => {
        if(messagesData){
            dispatch({type:'SET_USER_MESSAGES',payload: {
                username:selectedUser.username,
                messages: messagesData.getMessages
            }})
        }
    },[messagesData])

	let selectedChatMarkup
	if (!messages && !messagesLoading) {
	  selectedChatMarkup = <p className="info-text">Select a friend</p>
	} else if (messagesLoading) {
	  selectedChatMarkup = <p className="info-text">Loading..</p>
	} else if (messages.length > 0) {
	  selectedChatMarkup = messages.map((message, index) => (
		<React.Fragment key={message.id}>
			<Message  message={message}/>
			{index === messages.length -1 && (
				<div className="invisible">
					<hr className="m-0"/>
				</div>
			)}
		</React.Fragment>
	  ))
	} else if (messages.length === 0) {
	  selectedChatMarkup = <p className="info-text">You are now connected! send your first message!</p>
	}
	return (
		<Col xs={8}>
			<div className="messages-box d-flex flex-column-reverse">
			{selectedChatMarkup}
			</div>
			<Form onSubmit={submitMessage}>
				<Form.Group className="d-flex align-items-center">
					<Form.Control type="text" className="rounded-pill bg-grey"
					 placeholder="type a message..." value={content} onChange={e => setContent(e.target.value)} />
					 <i className="fa fa-paper-plane fa-2x text-primary mx-2" role="button" onClick={submitMessage}></i>
				</Form.Group>
				</Form>
		</Col>
	);
}

export default Messages;
