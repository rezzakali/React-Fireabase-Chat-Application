import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import Conversation from './Conversation';
import Messages from './Messages';
import User from './User';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState('');
  const [text, setText] = useState('');
  const [img, setImage] = useState('');
  const [msg, setMsg] = useState([]);

  // user1 is a logged in user
  const user1 = auth.currentUser.uid;

  const selectUser = async (user) => {
    setChat(user);
    // chatting user (specified user to start conversation)
    const user2 = chat.uid;
    // start chatting with user1 to user2 or vice versa
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    // create the message collection
    const messagesRef = collection(db, 'messages', id, 'chat');
    // sorting the messages in ascending order
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const msgs = [];
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsg(msgs);
    });
    // last message by the user and getting it from the database
    const onSnapDoc = await getDoc(doc(db, 'lastMessages', id));
    if (onSnapDoc.data() && onSnapDoc.data()?.from !== user1) {
      // update the doc (false the unread message)
      await updateDoc(doc(db, 'lastMessages', id), { unread: false });
    }
  };
  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user2 = chat.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    // uploading the media files
    let url;
    if (img) {
      const imgRef = await ref(
        storage,
        `image/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const durl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = durl;
    }
    // creating a message collection
    await addDoc(collection(db, 'messages', id, 'chat'), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || '',
    });
    // set the doc
    await setDoc(doc(db, 'lastMessages', id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || '',
      unread: true,
    });

    setText('');
  };

  useEffect(() => {
    const usersRef = collection(db, 'user');
    // create query object
    const q = query(usersRef, where('uid', 'not-in', [user1]));
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      // eslint-disable-next-line prefer-const
      let newUsers = [];
      // eslint-disable-next-line no-shadow
      querySnapshot.forEach((doc) => {
        newUsers.push(doc.data());
      });
      setUsers(newUsers);
    });
    return () => unsub();
  }, []);
  return (
    <div className="home_container">
      <div className="user_container">
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <div className="message_container">
        {chat ? (
          <>
            <div className="messages_of_user">
              <p>{chat.name}</p>
            </div>
            <div className="message">
              {msg.length
                ? msg.map((mg, id) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Conversation key={id} mg={mg} user1={user1} />
                  ))
                : null}
            </div>
            <Messages
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              img={img}
              setImage={setImage}
            />
          </>
        ) : (
          <p className="no_user_message">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Home;
