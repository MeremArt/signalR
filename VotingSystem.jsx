import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const VotingSystem = () => {
  const [votes, setVotes] = useState([]);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://your-dotnet-backend.com/votingHub') // Replace with the actual URL of your SignalR hub
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('SignalR Connected');
        })
        .catch((error) => console.error('SignalR Connection Error: ', error));

      connection.on('ReceiveVote', (vote) => {
        setVotes((prevVotes) => [...prevVotes, vote]);
      });
    }
  }, [connection]);

  const handleVote = (option) => {
    // Here, you can send the vote to the server using SignalR
    connection.invoke('SendVote', option).catch((error) => console.error('SendVote Error: ', error));
  };

  return (
    <div>
      <h1>Live Voting System</h1>
      <ul>
        {votes.map((vote, index) => (
          <li key={index}>{vote}</li>
        ))}
      </ul>
      <button onClick={() => handleVote('Option A')}>Vote for Option A</button>
      <button onClick={() => handleVote('Option B')}>Vote for Option B</button>
      <button onClick={() => handleVote('Option C')}>Vote for Option C</button>
    </div>
  );
};

export default VotingSystem;
