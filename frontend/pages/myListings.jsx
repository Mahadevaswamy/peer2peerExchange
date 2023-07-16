import { useState, useEffect } from "react";
import ListingCard from "../components/ListingCard";
import WithdrawCard from "../components/WithdrawCard";
import NewListingForm from "../components/NewListingForm";
import Table from "react-bootstrap/Table";
import React from "react";
import { useSigner } from "wagmi";
import { useContext } from 'react';
import { AccountContext } from '../pages/_app';

export default  function myListings() {
    const{ data: signer} = useSigner();
    const [listings, setListings] = useState([
  ]);
  const account = useContext(AccountContext);
    useEffect(() => {
    fetch("http://localhost:3001/getMyListings?address="+account.address)
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
      <h1 className="text-4xl mb-4">My Listings</h1>
      <Table striped bordered className="table-dark">
        <thead>
          <tr>
            <th>Listed Token</th>
            <th>Quantity</th>
            <th>Exchange token</th>
            <th>Price per unit</th>
            <th>Seller Address</th>
            <th>Request ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <WithdrawCard key={listing.id} listing={listing} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
