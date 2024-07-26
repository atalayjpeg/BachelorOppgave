// Login.tsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login();
  };

  const login = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true); // Update the isLoggedIn state
      navigate('/');
    }, 2000);
  }

  return (
    <div className="login-template d-flex justify-content-center align-items-center w-100 vh-100 bg-light-subtle">
      {loading ? (
        <Spinner animation="border" role="status" className="position-absolute">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <div className="w-50 p-5 rounded bg-white shadow-lg mb-5 border border-info-subtle">
          <h1>Logg inn</h1>
          <hr className="my-3"></hr>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label className="fw-bold">Brukernavn</Form.Label>
              <Form.Control
                type="text"
                placeholder="Brukernavn eller e-mail"
                value={username}
                onChange={handleUsernameChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label className="fw-bold">Passord</Form.Label>
              <Form.Control
                type="password"
                placeholder="Passord"
                value={password}
                onChange={handlePasswordChange}
              />
            </Form.Group>

            <div className="d-flex align-items-center mt-3 position-relative">
              <a href="https://ih1.redbubble.net/image.1740346758.2099/st,small,507x507-pad,600x600,f8f8f8.jpg" className="me-3">Glemt passord?</a>
              <Button variant="primary" type="submit" className="bg-secondary ml-5">
                Logg inn
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Login;
