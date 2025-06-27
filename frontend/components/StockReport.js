import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function StockReport() {
  const [report, setReport] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/reports/stock`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReport(data);
      } catch (err) {
        alert('Error fetching report');
      }
    };
    fetchReport();
  }, []);

  return (
    <Container>
      <Button onClick={() => navigate('/parts')}>Back to Parts</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Part Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {report.map(part => (
            <TableRow key={part.part_number}>
              <TableCell>{part.part_number}</TableCell>
              <TableCell>{part.name}</TableCell>
              <TableCell>{part.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default StockReport;