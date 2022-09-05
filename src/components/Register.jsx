import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import '../styles/Form.module.css';

function Register() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    error: null,
    loading: false,
  });
  const navigate = useNavigate();
  // object distructuring
  const { name, email, password, error, loading } = data;
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setData({ ...data, error: 'All blank field are required!' });
    }
    try {
      // creating new user
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // Add a new document in collection "cities"
      await setDoc(doc(db, 'user', result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        password,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });

      setData({
        name: '',
        email: '',
        password: '',
        error: null,
        loading: false,
      });
      navigate('/login');
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="enter your name"
        value={name}
        onChange={handleChange}
      />
      <br />
      <input
        type="text"
        name="email"
        placeholder="enter your email"
        value={email}
        onChange={handleChange}
      />
      <br />
      <input
        type="password"
        name="password"
        placeholder="enter your password"
        value={password}
        onChange={handleChange}
      />{' '}
      <br />
      {error ? <p>{error}</p> : null}
      <button type="submit" className="button" disabled={loading}>
        {loading ? 'Creating...' : 'Register'}
      </button>
    </form>
  );
}

export default Register;
