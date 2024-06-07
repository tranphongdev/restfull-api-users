import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import logo from '../assets/react.svg';
import { NavLink, Outlet } from 'react-router-dom';

function Header() {
    const activeNavLink = ({ isActive }) => (isActive ? 'active' : '');

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
                        <img src={logo} alt="Logo" /> TranPhongDev-App
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/" className={activeNavLink}>
                                Home
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/users" className={activeNavLink}>
                                Manager Users
                            </Nav.Link>
                            <NavDropdown title="Authen" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/login">Sign In</NavDropdown.Item>
                                <NavDropdown.Item href="/logout">Sign Out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </>
    );
}

export default Header;
