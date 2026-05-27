import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getCustomers, createCustomer, deleteCustomer } from '../api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone_number: '' });
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createCustomer(formData);
      setIsModalOpen(false);
      setFormData({ full_name: '', email: '', phone_number: '' });
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-6">
        <h1>Customers</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="glass-panel" style={{overflowX: 'auto'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>#{customer.id}</td>
                <td>{customer.full_name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone_number}</td>
                <td>
                  <button className="btn-danger" style={{padding: '0.4rem'}} onClick={() => handleDelete(customer.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-panel" style={{padding: '2rem', width: '100%', maxWidth: '500px'}}>
            <h2 className="mb-4">Add New Customer</h2>
            {error && <div className="mb-4 text-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input required type="text" className="form-control" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input required type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input required type="text" className="form-control" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
              </div>
              
              <div className="flex gap-4" style={{marginTop: '1rem'}}>
                <button type="submit" className="btn-primary" style={{flex: 1, justifyContent: 'center'}}>
                  Save Customer
                </button>
                <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)} style={{flex: 1}}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
