import React, { useEffect, useState } from 'react';
import AXIOS from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

export default function ViewUsers() {
    const [users, setUsers] = useState([]);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


    useEffect(() => {
        AXIOS.get(`${API_BASE_URL}/api/admin/viewusers`)
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const deleteUser = (id) => {    
        AXIOS.delete(`${API_BASE_URL}/api/admin/deleteuser/${id}`)
            .then(res => {
                alert(res.data);
                setUsers(prevUsers => prevUsers.filter(u => u._id !== id));
            })
            .catch(err => console.log(err));
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>View Users</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>SI</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.fullname}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        onClick={() => deleteUser(user._id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
