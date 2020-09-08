import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Image, Col } from 'react-bootstrap';
import { useMessageDispatch, useMessageState } from '../context/message';

const GET_USERS = gql`
	query getUsers {
		getUsers {
			username
			email
			createdAt
			imageUrl
			latestMessage {
				content
				from
				to
				createdAt
				id
			}
		}
	}
`;

function Users() {
	const dispatch = useMessageDispatch();
	const { users } = useMessageState();

	const selectedUser = users?.find((u) => u.selected === true)?.username

	const { loading } = useQuery(GET_USERS, {
	  onCompleted: (data) =>
		dispatch({ type: 'SET_USERS', payload: data.getUsers }),
	  onError: (err) => console.log(err),
	})


	let usersMarkup;
	if (!users || loading) {
		usersMarkup = <p>Loading...</p>;
	}
	else if (users.length === 0) {
		usersMarkup = <p>No users have joined yet</p>;
	}
	else if (users.length > 0) {
		usersMarkup = users.map((user) => {
			// console.log(user, 'user');
			const selected = selectedUser === user.username;
			return (
				<div
					className={`d-flex p-3 user-div ${
						selected ? 'bg-white' :
						''}`}
					key={user.username}
					style={{ cursor: 'pointer' }}
					onClick={() => dispatch({ type: 'SET_SELECTED_USER', payload: user.username })}
				>
					<Image
						src={user.imageUrl}
						className="mr-2 user-image"
					/>
					<div>
						<p className="text-success">{user.username}</p>
						<p className="font-weight-light d-none d-lg-block">
							{
								user.latestMessage ? user.latestMessage.content :
								'You are now connected !'}
						</p>
					</div>
					<hr className="solid" />
				</div>
			);
		});
	}
	return (
		<Col xs={4} className="p-0" style={{ backgroundColor: '#e6e6e6' }}>
			{usersMarkup}
		</Col>
	);
}

export default Users;
