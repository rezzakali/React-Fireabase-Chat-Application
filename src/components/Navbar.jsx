import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { auth, db } from '../firebase';
import Logout from '../icons/Logout';
import '../styles/Navbar.module.css';

function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await updateDoc(doc(db, 'user', auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    await navigate('/login');
  };
  return (
    <nav>
      <div className="logo">
        <h3>Chat Application</h3>
      </div>
      {user ? (
        <div className="links">
          <Link to="/profile">Profile</Link>
          <button type="button" className="button" onClick={handleSignOut}>
            <Logout />
          </button>
        </div>
      ) : (
        <div className="links">
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
