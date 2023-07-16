import { ConnectButton } from '@rainbow-me/rainbowkit';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function ColorSchemesExample() {
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/" className="font-weight-bold">Home</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/post" className="font-weight-bold">Post</Nav.Link>
            <Nav.Link href="/listings" className="font-weight-bold">All Listings</Nav.Link>
            <Nav.Link href="/myListings" className="font-weight-bold">My Listings</Nav.Link>
          </Nav>
          <ConnectButton />
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;
