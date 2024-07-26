import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [gstNumber, setGstNumber] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedYears, setExpandedYears] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await axios.get(`https://pabli-backend.onrender.com/gst-details/${gstNumber}`);
      setLoading(false);
      setData(response.data);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch GST details');
    }
  };

  const toggleYear = (year) => {
    setExpandedYears((prevExpandedYears) => ({
      ...prevExpandedYears,
      [year]: !prevExpandedYears[year],
    }));
  };

  return (
    <div className="App">
      <h1>GST Details Viewer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setGstNumber(e.target.value)}
          placeholder="Enter GST Number (e.g. 29AAACB2108H1ZI)"
          style={{
            width: '300px',
            height: '30px',
            color: 'black',
          }}
        />
        <button type="submit" className="button">Fetch Details</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">Error fetching GST details. Please try again later.</p>}
      {data && (
        <div className="details">
          <h2>GST Details</h2>
          <div className="box"><strong>Legal Name:</strong> {data.company_details.legal_name}</div>
          <div className="box"><strong>Trade Name:</strong> {data.company_details.trade_name}</div>
          <div className="box"><strong>GST Number:</strong> {data.company_details.gst_number}</div>
          <div className="box"><strong>Registration Date:</strong> {data.company_details.registration_date}</div>

          {data.company_details.address && data.company_details.address.length > 0 && (
            <div className="box">
              <h3>Addresses</h3>
              {data.company_details.address.map((item, index) => (
                <div key={index} className="address">
                  <h4>Address {index + 1}</h4>
                  <p><strong>Building Name:</strong> {item.address.buildingName}</p>
                  <p><strong>Street:</strong> {item.address.street}</p>
                  <p><strong>Location:</strong> {item.address.location}</p>
                  <p><strong>Building Number:</strong> {item.address.buildingNumber}</p>
                  <p><strong>District:</strong> {item.address.district}</p>
                  <p><strong>Locality:</strong> {item.address.locality}</p>
                  <p><strong>Locationality:</strong> {item.address.locationality}</p>
                  <p><strong>Pincode:</strong> {item.address.pincode}</p>
                  <p><strong>Landmark:</strong> {item.address.landMark}</p>
                  <p><strong>State Code:</strong> {item.address.stateCode}</p>
                  <p><strong>GeoCode Level:</strong> {item.address.geoCodeLevel}</p>
                  <p><strong>Floor Number:</strong> {item.address.floorNumber}</p>
                  <p><strong>Landmark Coordinates:</strong> {item.address.landmark}</p>
                  <p><strong>Nature:</strong> {item.nature}</p>
                </div>
              ))}
            </div>
          )}

          <h3>Financial Details</h3>
          {Object.keys(data.financial_details.fillingData).map((year) => (
            <div key={year} className="year-section">
              <div className="year-header" onClick={() => toggleYear(year)}>
                <h4>{year}</h4>
                <button>
                  {expandedYears[year] ? '▲' : '▼'}
                </button>
              </div>
              {expandedYears[year] && (
                <div className="filings">
                  {data.financial_details.fillingData[year].length > 0 ? (
                    data.financial_details.fillingData[year].map((filing, index) => (
                      <div key={index} className="filing-block">
                        <p><strong>Return Type:</strong> {filing.returnType}</p>
                        <p><strong>Return Period:</strong> {filing.returnPeriod}</p>
                        <p><strong>Date of Filing:</strong> {filing.dateOfFiling}</p>
                        <p><strong>Status:</strong> {filing.status}</p>
                        <p><strong>ARN:</strong> {filing.arn}</p>
                      </div>
                    ))
                  ) : (
                    <p>Not found</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
