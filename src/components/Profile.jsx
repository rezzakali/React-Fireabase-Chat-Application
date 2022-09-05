import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import Camera from '../icons/Camera';
import Delete from '../icons/Delete';
import profilePicture from '../image/profile.jpg';

function Profile() {
  const [img, setImg] = useState('');
  const [user, setUser] = useState();

  const navigate = useNavigate();
  const deleteImg = async () => {
    try {
      // eslint-disable-next-line no-alert, no-undef
      const confirm = window.confirm(
        'Do you want to delete your profile picture?'
      );
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));
        await updateDoc(doc(db, 'user', auth.currentUser.uid), {
          avatar: '',
          avatarPath: '',
        });
        navigate('/');
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getDoc(doc(db, 'user', auth.currentUser.uid)).then((snapDoc) => {
      if (snapDoc.exists) {
        setUser(snapDoc.data());
      }
    });
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, 'user', auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setImg('');
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
    }
  }, [img]);
  return user ? (
    <div className="profile_container">
      <div className="image_container">
        <img src={user.avatar || profilePicture} alt="avatar" />
        <div className="overlay">
          <div>
            <label htmlFor="photo">
              <Camera />
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="photo"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </label>
            {user.avatar ? <Delete deleteImg={deleteImg} /> : null}
          </div>
        </div>
      </div>
      <div className="text_container">
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <hr />
        <small>Joined on: {user.createdAt.toDate().toDateString()}</small>
      </div>
    </div>
  ) : null;
}

export default Profile;
