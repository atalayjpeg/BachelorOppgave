import React from 'react';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';

interface AboutProps {
  isLoggedIn: boolean;
  toggleLogin: () => void;
}

const About: React.FC<AboutProps> = ({ isLoggedIn, toggleLogin }) => {
  return (
    <div className='container-fluid' style={{maxHeight:"100vh", overflowY:"auto"}}>
      <div className='row'>
        <Navbar isLoggedIn={isLoggedIn} toggleLogin={toggleLogin}/>

        <div className='col-10 offset-2 bg-dark-subtle'>
        <h2>Om oss</h2>
          <hr className='my-4'></hr>
          <div className='bg-light p-3 mb-2'>
            <h3>Hvem er bak Krios?</h3>
            <p>
            Krios er utviklet for SINTEF Community under et bachelorprosjekt i informasjonsteknologi ved Høyskolen Kristiania Oslo våren 2024. Gruppen består av fem studenter fra linjene frontend- og mobilutvikling, programmering og cybersikkerhet. 
            </p>
            </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
};

export default About;