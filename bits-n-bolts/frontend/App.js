import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import PartsList from './components/PartsList';
import PartForm from './components/PartForm';
import StockReport from './components/StockReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/parts" element={<PartsList />} />
        <Route path="/add-part" element={<PartForm />} />
        <Route path="/edit-part/:id" element={<PartForm />} />
        <Route path="/report" element={<StockReport />} />
      </Routes>
    </Router>
  );
}

export default App;