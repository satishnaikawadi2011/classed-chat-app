import React from 'react';
import { useAuthState } from '../context/auth';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';

function Message({ message }) {
	const { user } = useAuthState();
	const sent = message.from === user.username;
	const received = !sent;
	const msgBg =
		sent ? 'bg-primary' :
		'bg-grey';
	const textColor =
		sent ? 'text-white' :
		'text-black';
	const msgPosition =
		sent ? 'ml-auto' :
		'mr-auto';
	return (
		<OverlayTrigger
			placement={

					sent ? 'right' :
					'left'
			}
			overlay={<Tooltip>{moment(message.createdAt).format('MMMM DD, YYYY @ h:mm a')}</Tooltip>}
		>
			<div className={`d-flex my-3 ${msgPosition}`}>
				<div className={`d-flex py-2 px-3 rounded-pill ${msgBg}`}>
					<p className={textColor}>{message.content}</p>
				</div>
			</div>
		</OverlayTrigger>
	);
}

export default Message;
