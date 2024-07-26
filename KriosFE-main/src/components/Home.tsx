// Home.tsx
import React from 'react';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Footer';
import LanderFrontImage from '../assets/Images/Lander-Front-Image.jpg';
import Header from './Header';

interface HomeProps {
  isLoggedIn: boolean;
  toggleLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn, toggleLogin }) => {
  return (
    <div className='container-fluid' style={{ maxHeight: "100vh", overflowY: "auto" }}>
      <div className='row'>
        <Header isLoggedIn={isLoggedIn} toggleLogin={toggleLogin} />
        <Navbar isLoggedIn={isLoggedIn} toggleLogin={toggleLogin} />

        <div className='col-10 offset-2 bg-dark-subtle'>
          <div style={{ height: 400, width: '100%' }} className='bg-light mb-2 overflow-hidden position-relative'>
            <p style={{ marginTop: 155 }} className='position-absolute text-white fs-1 ms-2'>Krios</p>
            <p style={{ marginTop: 200 }} className='position-absolute text-white fs-5 ms-2'>Klimadata på ett sted på en lett og fin måte</p>

            <img
              src={LanderFrontImage}
              alt='Sjø Bilde fra SINTEF'
              style={{ width: '100%' }}
            />
          </div>

          <div className='bg-light p-3 mb-2'>
            <h3>Hva er Krios?</h3>
            <p>
              Krios er en webapplikasjon som samler klimadata fra resurser til ett sted og vises på en lett og fin måte.
            </p>
          </div>

          <div className='bg-light p-3 mb-2'>
            <h3>Hva kan jeg gjøre med Krios?</h3>
            <p>
              Med Krios kan man sammenstille kart- og klimadata for områder. Man kan få data om vær, geologi og klima.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
