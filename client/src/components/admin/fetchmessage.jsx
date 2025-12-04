import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function FetchMessage() {
  const [messages, setMessages] = useState([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Fetch the messages from the API
    axios
      .get(`${API_BASE_URL}/api/admin/viewmessage`)
      .then(response => {
        console.log(response.data);
        setMessages(response.data); // Set the fetched messages in state
      })
      .catch(error => {
        console.error("There was an error fetching the messages:", error);
      });
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div className="container mt-4">
      <h2>Messages</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.length > 0 ? (
              messages.map((message) => (
                <TableRow key={message._id}>
                  <TableCell>{message._id}</TableCell>
                  <TableCell>{message.Name}</TableCell>
                  <TableCell>{message.Email}</TableCell>
                  <TableCell>{message.Message}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No messages found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
