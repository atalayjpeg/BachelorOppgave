import { NavLink } from "react-router-dom";
import kriosLogo from '../assets/Images/Krios-Logo-noBg.png';

interface NavbarProps {
  isLoggedIn: boolean;
  toggleLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, toggleLogin }) => {
  return (
    <div className="bg-dark vh-100 position-fixed col-2">
      <div className="nav flex-column flex-nowrap vh-100 overflow-auto text-white p-2">
        <NavLink to='/'>
          <img src={kriosLogo} alt="Logo av Krios" style={{ width: 50 }} className="mb-3" />
        </NavLink>

        <NavLink className='text-white text-decoration-none ms-1 mb-2 fs-5 fw-bold' to='/'>
          Krios
        </NavLink>

        <NavLink
          className={`fs-5 text-decoration-none ms-2  text-white`}
          to={isLoggedIn ? '/map' : '#'}
          onClick={(e) => !isLoggedIn && e.preventDefault()}
          style={{ cursor: !isLoggedIn ? 'not-allowed' : 'pointer' }}
        >
          Kart
        </NavLink>

        <div style={{ backgroundColor: '#52823b', width: 'auto', height: 2 }}></div>

        <NavLink className='text-white fs-5 text-decoration-none ms-2' to='/more'>
          Lær mer
        </NavLink>

        <div style={{ backgroundColor: '#287891', width: 'auto', height: 2 }}></div>

        <NavLink className='text-white fs-5 text-decoration-none ms-2' to='/about'>
          Om oss
        </NavLink>

        <div style={{ backgroundColor: '#81710a', width: 'auto', height: 2 }}></div>
      </div>
    </div>
  );
};

export default Navbar;
