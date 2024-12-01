import { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Row, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.scss';
import './styles/global_styles.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import brandLogo from './assets/react_firebase.png';
import { useAuth } from "./auth_context";

export default function Header() {
  const router = useRouter();
  const { userData, setUserData } = useAuth();
  const [activeKey, setActiveKey] = useState(0);

  useEffect(() => {
      const page = document.location.pathname.split('/')[1];

      if (page == 'country_list') {
        setActiveKey(3)
      } else if (page == 'about') {
        setActiveKey(2)
      }  else if (page == 'dashboard') {
        setActiveKey(1)
      }

  //   if (!userData) {
  //     router.push("/");
  //     return;
  //   }
  }, [router, userData]);

  function handleLogout(){
    console.log("========= logout ========", userData)
    setUserData(null);
    console.log("========= logout 2 ========", userData)
    router.push('/');
  }

  return (
    <Navbar bg="primary" data-bs-theme="light" collapseOnSelect expand="lg">
      <Container>
        <Navbar.Brand href="#" onClick={(event) => {event.preventDefault();}}>
          <Image src={brandLogo} alt='Navbar' width={150} height={40} quality={80} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav activeKey={activeKey} onSelect={(key) => setActiveKey(Number(key))} className="me-auto">
            <Nav.Link eventKey={1} href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link eventKey={2} href="/about">About</Nav.Link>
            <Nav.Link eventKey={3} href="/country_list">Country Table</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="#" onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}