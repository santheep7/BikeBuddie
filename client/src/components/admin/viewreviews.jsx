import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import Sentiment from 'sentiment';

// Initialize sentiment analysis
const sentiment = new Sentiment();

// Function to get sentiment score using Sentiment library
const getSentimentScore = (review) => {
  const result = sentiment.analyze(review);
  return result.score; // The score indicates the overall sentiment
};

export default function Viewreviews() {
  const [reviews, setReviews] = useState([]);
  const [reviewCategories, setReviewCategories] = useState({
    bad: [],
    average: [],
    good: [],
    excellent: [],
  });
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/viewreviews`)
      .then((res) => {
        const reviewsData = res.data;
        setReviews(reviewsData);
        console.log(reviewsData)
      
        const categorizedReviews = { bad: [], average: [], good: [], excellent: [] };
        reviewsData.forEach((review) => {
          const sentimentScore = getSentimentScore(review.review);
          console.log(sentimentScore)
          if (sentimentScore <= -2) {
            categorizedReviews.bad.push(review); 
          } else if (sentimentScore === 0) {
            categorizedReviews.average.push(review); 
          } else if (sentimentScore > 0 && sentimentScore <= 2) {
            categorizedReviews.good.push(review); 
          } else {
            categorizedReviews.excellent.push(review);
          }
        });

        setReviewCategories(categorizedReviews);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleReviewClick = (id) => {
    console.log(id)
    axios.put(`${API_BASE_URL}/admin/review`,{},{headers:{id:id}})
    .then((res)=>{
      alert(res.data)
    }).catch((err)=>{
      console.log(err)
    })
  };

  return (
    <div className="container mx-auto p-6 mt-12">
      <Typography variant="h4" align="center" gutterBottom>
        Reviews
      </Typography>

      {/* Display Bad Reviews */}
      <Typography variant="h6" gutterBottom>
        Bad Reviews ({reviewCategories.bad.length})
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Start Address</TableCell>
              <TableCell>End Address</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Fare</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewCategories.bad.map((review, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{review.startAddress}</TableCell>
                <TableCell>{review.endAddress}</TableCell>
                <TableCell>{review.totalDistance}</TableCell>
                <TableCell>{review.fare}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.review}</TableCell>
                <TableCell>{review.userId?.fullname}</TableCell>
                <TableCell>
                  <Button onClick={() => handleReviewClick(review._id)}>POST</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Display Average Reviews */}
      <Typography variant="h6" gutterBottom>
        Average Reviews ({reviewCategories.average.length})
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Start Address</TableCell>
              <TableCell>End Address</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Fare</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewCategories.average.map((review, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{review.startAddress}</TableCell>
                <TableCell>{review.endAddress}</TableCell>
                <TableCell>{review.totalDistance}</TableCell>
                <TableCell>{review.fare}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.review}</TableCell>
                <TableCell>{review.userId?.fullname}</TableCell>
                <TableCell>
                  <Button onClick={() => handleReviewClick(review._id)}>Post</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Display Good Reviews */}
      <Typography variant="h6" gutterBottom>
        Good Reviews ({reviewCategories.good.length})
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Start Address</TableCell>
              <TableCell>End Address</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Fare</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewCategories.good.map((review, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{review.startAddress}</TableCell>
                <TableCell>{review.endAddress}</TableCell>
                <TableCell>{review.totalDistance}</TableCell>
                <TableCell>{review.fare}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.review}</TableCell>
                <TableCell>{review.userId?.fullname}</TableCell>
                <TableCell>
                  <Button onClick={() => handleReviewClick(review._id)}>Post</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Display Excellent Reviews */}
      <Typography variant="h6" gutterBottom>
        Excellent Reviews ({reviewCategories.excellent.length})
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Start Address</TableCell>
              <TableCell>End Address</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Fare</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewCategories.excellent.map((review, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{review.startAddress}</TableCell>
                <TableCell>{review.endAddress}</TableCell>
                <TableCell>{review.totalDistance}</TableCell>
                <TableCell>{review.fare}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.review}</TableCell>
                <TableCell>{review.userId?.fullname}</TableCell>
                <TableCell>
                  <Button onClick={() => handleReviewClick(review._id)}>Post</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
