import { useState, useEffect } from "react";
import ListingCard from "../components/ListingCard";
import NewListingForm from "../components/NewListingForm";
import Table from "react-bootstrap/Table";

export default function Listings() {
  const [listings, setListings] = useState([
  ]);

  useEffect(() => {
    fetch("http://localhost:3001/getAllSellers")
      .then((response) => response.json())
      .then((data) => {
        setListings(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="text-white p-6 bg-dark">
      <h1 className="text-4xl mb-4">Listings</h1>
      <Table striped bordered className="table-dark">
        <thead>
          <tr>
            <th>Listed Token</th>
            <th>Quantity</th>
            <th>Exchange token</th>
            <th>Price per unit</th>
            <th>Seller Address</th>
            <th>Request ID</th>
            <th>Trade</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
