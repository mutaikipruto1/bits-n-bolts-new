import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Container } from '@mui/material';

function PartsList() {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/parts?search=${search}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setParts(data);
      } catch (err) {
        alert('Error fetching parts');
      }
    };
    fetchParts();
  }, [search]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/parts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParts(parts.filter(part => part.id !== id));
    } catch (err) {
      alert('Error deleting part');
    }
  };

  return (
    <Container>
      <TextField
        label="Search Parts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={() => navigate('/add-part')}>Add Part</Button>
      <Button onClick={() => navigate('/report')}>View Report</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Part Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parts.map(part => (
            <TableRow key={part.id}>
              <TableCell>{part.part_number}</TableCell>
              <TableCell>{part.name}</TableCell>
              <TableCell>{part.category}</TableCell>
              <TableCell>{part.quantity}</TableCell>
              <TableCell>${part.price}</TableCell>
              <TableCell>
                <Button onClick={() => navigate(`/edit-part/${part.id}`)}>Edit</Button>
                <Button onClick={() => handleDelete(part.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default PartsList;