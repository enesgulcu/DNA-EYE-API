"use client";
import { useState } from 'react';

export default function SendSMS() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [status, setStatus] = useState('');

  const handleSendSMS = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setStatus(`SMS sent to ${phoneNumber}: ${message}`);
      } else {
        setStatus('Failed to send SMS: ' + data.error);
      }
    } catch (error) {
      setStatus('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Send SMS</h1>
      <form onSubmit={handleSendSMS}>
        <input
          type="text"
          placeholder="Message"
          className="text-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
    
        <button type="submit">Send SMS</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
