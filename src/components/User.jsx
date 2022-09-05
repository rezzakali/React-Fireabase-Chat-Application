import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import Img from '../image/profile.jpg';

const User = ({ user, selectUser, user1, chat }) => {
  const user2 = user.uid;
  const [data, setData] = useState('');
  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    // eslint-disable-next-line no-shadow
    const unsub = onSnapshot(doc(db, 'lastMessages', id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);
  return (
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && 'selected_user'}`}
      >
        <div className="user_info" onClick={() => selectUser(user)}>
          <div className="user_details">
            <img src={user.avatar || Img} alt="avatar" />
            <h5>{user.name}</h5>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
            )}
          </div>
          <div
            className={`user_status ${user.isOnline ? 'online' : 'offline'}`}
          />
        </div>
        {data && (
          <p className="truncate">
            <strong>{data.from === user1 ? 'Me:' : null}</strong>
            {data.text}
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.name === user.name && 'selected_user'}`}
      >
        <img
          src={user.avatar || Img}
          alt="avatar"
          className="avatar sm_screen"
        />
      </div>
    </>
  );
};

export default User;
