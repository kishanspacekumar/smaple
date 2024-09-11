import React, { useState, useEffect } from 'react';

// Define the card reader configuration
const magstripeReader = {
  Data: "",
  Start: null,
  IdStartSentinel: ";",
  IdEndSentinel: "?",
  IdFieldSeparator: "="
};

const CardReader = () => {
  const [swipedData, setSwipedData] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  // Function to handle keystrokes for card reading
  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault();

      if (event.key === magstripeReader.IdStartSentinel) {
        magstripeReader.Data = "";
        magstripeReader.Start = new Date();
      } else if (magstripeReader.Start) {
        if (event.key === magstripeReader.IdEndSentinel) {
          magstripeReader.Start = null;
          const cardData = magstripeIdReaderParseData();
          setSwipedData(cardData);
          return;
        }
        magstripeReader.Data += event.key;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Function to parse card data
  const magstripeIdReaderParseData = () => {
    const stateCode = magstripeReader.Data.substr(0, 6);
    const fields = magstripeReader.Data.split(magstripeReader.IdFieldSeparator);
    let id = fields[0].substr(6);
    const dob = fields[1].substr(4);

    if (fields[2]?.length > 0) {
      if (stateCode === "636032") {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const idprefix = alphabet[fields[2] - 1];
        id = idprefix + id;
      } else {
        id += fields[2];
      }
    }

    return { Id: id, StateIIN: stateCode, DOB: dob };
  };

  return (
    <div>
      <div className='fields'>Swiped Information</div>
      <input type='text' name='swiped' id='swiped' value={swipedData.Id || ""} readOnly />
      <div className='fields'>First Name</div>
      <input type='text' name='first_name' id='first_name' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      <div className='fields'>Last Name</div>
      <input type='text' name='last_name' id='last_name' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      <div className='fields'>Expiration</div>
      <input type='text' size='8' name='expiration' id='expiration' value={expiration} onChange={(e) => setExpiration(e.target.value)} required /> (MMYY)
      <div className='fields'>CVV Code</div>
      <input type='text' size='8' name='cvv' id='cvv' value={cvv} onChange={(e) => setCvv(e.target.value)} required />
      <div className='fields'>Credit Card Number</div>
      <input type='text' name='card' id='card' value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
      <hr />
      <div className='buttons'>
        <button onClick={() => document.getElementById('swiped').focus()} style={{ cursor: 'pointer', color: 'red' }}>
          Swipe Credit Card
        </button>
      </div>
    </div>
  );
};

export default CardReader;
