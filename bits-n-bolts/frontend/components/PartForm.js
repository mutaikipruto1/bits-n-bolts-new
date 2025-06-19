import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container } from '@mui/material';

function PartForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState({ part_number: '', name: '', category: '', quantity: 0, price: 0 });

  useEffect(() => {
    if (id) {
      const fetchPart = async () => {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/parts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPart(data);
      };
      fetchPart();
    }
  }, [id]);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      if (id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/parts/${id}`, part, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/parts`, part, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/parts');
    } catch (err) {
      alert('Error saving part');
    }
  };

  return (
    <Container>
      <TextField
        label="Part Number"
        value={part.part_number}
        onChange={(e) => setPart({ ...part, part_number: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Name"
        value={part.name}
        onChange={(e) => setPart({ ...part, name: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Category"
        value={part.category}
        onChange={(e) => setPart({ ...part, category: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Quantity"
        type="number"
        value={part.quantity}
        onChange={(e) => setPart({ ...part, quantity: parseInt(e.target.value) })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        type="number"
        value={part.price}
        onChange={(e) => setPart({ ...part, price: parseFloat(e.target.value) })}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleSubmit}>Save</Button>
    </Container>
  );
}

export default PartForm;