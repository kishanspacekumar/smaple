// How It Works in Your Context
// In your card reader implementation, the keydown event is used to capture the data from the card swipe:

// Start Sentinel (;): When the ; key is pressed, it indicates the start of a card swipe. You reset the data and record the start time.
// Data Collection: As subsequent keys are pressed, they are appended to the magstripeReader.Data string.
// End Sentinel (?): When the ? key is pressed, it indicates the end of the card swipe. You then parse the collected data and process it.
// Example Implementation
// Here’s a simplified example of how the keydown event is used to handle card swipe data:

document.addEventListener("keydown", function(event) {
    event.preventDefault();

    if (event.key === magstripeReader.IdStartSentinel) {
        // Start of card swipe
        magstripeReader.Data = "";
        magstripeReader.Start = new Date();
    } else if (magstripeReader.Start) {
        // Card data is being read
        if (event.key === magstripeReader.IdEndSentinel) {
            // End of card swipe
            magstripeReader.Start = null;
            const cardData = magstripeIdReaderParseData();
            console.log(cardData);
        } else {
            // Append the key to the data string
            magstripeReader.Data += event.key;
        }
    }
});


// Full Example in React
// Here's a React component using the keydown event to capture and handle card swipe data:

import React, { useState, useEffect } from 'react';

const magstripeReader = {
  Data: "",
  Start: null,
  IdStartSentinel: ";",
  IdEndSentinel: "?",
  IdFieldSeparator: "="
};

const CardReader = () => {
  const [swipedData, setSwipedData] = useState("");

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
          setSwipedData(cardData.Id);
        } else {
          magstripeReader.Data += event.key;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
      <input type='text' name='swiped' id='swiped' value={swipedData} readOnly />
      {/* Other form fields */}
    </div>
  );
};

export default CardReader;

// In this React component, the keydown event listener is added and removed within the useEffect hook, ensuring that it listens for key events when the component is mounted 
//   and cleans up when the component is unmounted. This approach keeps the code clean and avoids potential memory leaks.
