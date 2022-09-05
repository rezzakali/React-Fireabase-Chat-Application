import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import '../styles/Form.module.css';

function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
    error: null,
    loading: false,
  });

  const navigate = useNavigate();

  // object distructuring
  const { email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setData({ ...data, error: 'All blank field are required!' });
    }
    try {
      // creating new user
      const result = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // Add a new document in collection "cities"
      await updateDoc(doc(db, 'user', result.user.uid), {
        isOnline: true,
      });

      setData({
        email: '',
        password: '',
        error: null,
        loading: false,
      });
      navigate('/');
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
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
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default Login;
