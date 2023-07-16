import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import { AccountContext } from '../pages/_app';
import { useContext } from 'react';

export default function NewListingForm() {
  const [tokenToBuy, setTokenToBuy] = useState("");
  const [amountToBuy, setAmountToBuy] = useState("");
  const [tokenToSell, setTokenToSell] = useState("");
  const [amountToSell, setAmountToSell] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const account = useContext(AccountContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      "address": account.address,
      "token": tokenToBuy,
      "amount": amountToSell,
      "exchangeToken": tokenToSell,
      "unitAmount": amountToBuy,
    };

    alert(JSON.stringify(formData));
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
    };

    fetch("http://localhost:3001/sellToken",requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Transaction status - "+data.status+". Txn link - "+data.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Error");
      });
  };

  return (
    <Form onSubmit={handleSubmit} className='bg-dark'>
      <Col className="d-flex align-items-center justify-content-center">
        <h1 className="text-4xl mb-4">Post new listing</h1>
      </Col>
      <Row className="mb-3">
        <Form.Group as={Col} md={6}>
          <Form.Label className="d-flex align-items-center justify-content-center">Sell Token</Form.Label>
          <Form.Select
            value={tokenToBuy}
            onChange={(e) => setTokenToBuy(e.target.value)}
            required
          >
            <option value="">-- Select token to buy --</option>
            <option value="MUSDC">MUSDC</option>
            <option value="SUSDC">SUSDC</option>
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md={6}>
          <Form.Label className="d-flex align-items-center justify-content-center">Exchange with</Form.Label>
          <Form.Select
            value={tokenToSell}
            onChange={(e) => setTokenToSell(e.target.value)}
            required
          >
            <option value="">-- Select token to sell --</option>
            <option value="MUSDC">MUSDC</option>
            <option value="SUSDC">SUSDC</option>
          </Form.Select>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md={6}>
          <Form.Label className="d-flex align-items-center justify-content-center">Quantity</Form.Label>
          <Form.Control
            type="number"
            value={amountToSell}
            onChange={(e) => setAmountToSell(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group as={Col} md={6}>
          <Form.Label className="d-flex align-items-center justify-content-center">Price per unit</Form.Label>
          <Form.Control
            type="number"
            value={amountToBuy}
            onChange={(e) => setAmountToBuy(e.target.value)}
            required
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">

      </Row>
      <Col className="d-flex align-items-center justify-content-center">
        <Button variant="primary col-2 m-4" type="submit" onSubmit={handleSubmit}>
          Create Listing
        </Button>
      </Col>
    </Form>
  );
}