import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import axios from 'axios';
import Sentiment from 'sentiment';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export default function ViewRating() {
  const userid = localStorage.getItem("id");
  const [reviews, setReviews] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Fetch reviews from the server
    axios.get(`${API_BASE_URL}/api/rider/viewrating`, { headers: { id: userid } })
      .then((res) => {
        console.log(res.data);
        setReviews(res.data); // Store the fetched reviews
      }).catch((err) => {
        console.log(err);
      });
  }, [userid]);

  // Function to analyze sentiment of reviews
  const analyzeSentiment = (reviewText) => {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(reviewText);
    return result.score; // positive or negative sentiment score
  };

  useEffect(() => {
    // Perform sentiment analysis once reviews are fetched
    if (reviews.length > 0) {
      const sentimentScores = reviews.map(review => analyzeSentiment(review.review)); // assuming `review` contains the review text
      setSentiments(sentimentScores); // Store sentiment scores
    }
  }, [reviews]);

  // Function to map sentiment score to sentiment label
  const getSentimentLabel = (score) => {
    if (score > 0) return "Positive";
    if (score < 0) return "Negative";
    return "Neutral";
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <Typography variant="h4" gutterBottom>
          Review Ratings
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Review</strong></TableCell>
                <TableCell>Rating</TableCell>
                <TableCell><strong>Sentiment</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review, index) => (
                <TableRow key={index}>
                  <TableCell>{review.review}</TableCell>
                  <TableCell>{review.rating}Star</TableCell>
                  <TableCell>{getSentimentLabel(sentiments[index])}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
