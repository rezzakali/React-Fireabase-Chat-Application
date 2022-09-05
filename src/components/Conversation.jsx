import React, { useEffect, useRef } from 'react';
import Moment from 'react-moment';

function Conversation({ mg, user1 }) {
  // auto scrolling the message form container
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [mg]);
  return (
    <div
      className={`message_wrapper ${mg.from === user1 ? 'own' : ''}`}
      ref={scrollRef}
    >
      <p className={mg.from === user1 ? 'me' : 'friend'}>
        {mg.media ? <img src={mg.media} alt={mg.text} /> : null}
        {mg.text}
        <br />
        <small>
          <Moment fromNow>{mg.createdAt.toDate()}</Moment>
        </small>
      </p>
    </div>
  );
}

export default Conversation;
