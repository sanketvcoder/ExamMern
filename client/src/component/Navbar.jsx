import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/get-user-email', {
          withCredentials: true
        });
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchEmail();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <h3 className='title'>📝 Exam Control</h3>
      </div>
      <div style={styles.right}>
        <span style={styles.email}>{email}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
    title: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    color: '#2c3e50',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#f0f4f8',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  left: {
    fontWeight: 'bold',
    fontSize: '20px'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  email: {
    fontSize: '16px',
    color: '#333'
  },
  logoutBtn: {
    padding: '6px 12px',
    backgroundColor: '#ff5c5c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Navbar;
