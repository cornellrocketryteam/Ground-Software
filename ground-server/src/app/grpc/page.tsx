'use client';

import { useState, useEffect } from 'react';
import { runSendCommand } from './commandClient';

export default function GrpcPage() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    runSendCommand().then(res => {
      if (res.ack) {
        setMessage("Command Acknowledged!")
      } else {
        setMessage("No Acknowledgement Received")
      }
    }).catch((error) => {
      console.error(error);
      setMessage("Error: Cannot Connect. Is the Fill Station Running?\n" + error);
    })
  }, []);

  return (
    <div>
      <h1>gRPC Example</h1>
      <p>{message}</p>
    </div>
  );
}