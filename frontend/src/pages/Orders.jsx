import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye } from 'lucide-react';
import { getOrders, createOrder, deleteOrder, getProducts, getCustomers } from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [formData, setFormData] = useState({ customer_id: '', items: [] });
  const [currentItem, setCurrentItem] = useState({ product_id: '', quantity: 1 });
  const [error, setError] = useState('');

  const fetchInitialData = async () => {
    try {
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        getOrders(), getProducts(), getCustomers()
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddItem = () => {
    if (!currentItem.product_id || currentItem.quantity < 1) return;
    
    // Check if product exists in items, update quantity if so
    const existingIndex = formData.items.findIndex(i => i.product_id === currentItem.product_id);
    let newItems = [...formData.items];
    
    if (existingIndex >= 0) {
      newItems[existingIndex].quantity += currentItem.quantity;
    } else {
      newItems.push({ ...currentItem });
    }
    
    setFormData({ ...formData, items: newItems });
    setCurrentItem({ product_id: '', quantity: 1 });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.customer_id) {
      setError('Please select a customer');
      return;
    }
    if (formData.items.length === 0) {
      setError('Please add at least one product');
      return;
    }

    try {
      await createOrder(formData);
      setIsModalOpen(false);
      setFormData({ customer_id: '', items: [] });
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while creating order');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel/delete this order?')) {
      try {
        await deleteOrder(id);
        fetchInitialData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const product = products.find(p => p.id == item.product_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-6">
        <h1>Orders</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create Order
        </button>
      </div>

      <div className="glass-panel" style={{overflowX: 'auto'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const customer = customers.find(c => c.id === order.customer_id);
              return (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{customer ? customer.full_name : 'Unknown'}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>${order.total_amount.toFixed(2)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-outline" style={{padding: '0.4rem'}} onClick={() => {
                        setSelectedOrder(order);
                        setIsViewModalOpen(true);
                      }}>
                        <Eye size={16} />
                      </button>
                      <button className="btn-danger" style={{padding: '0.4rem'}} onClick={() => handleDelete(order.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No orders found.</td>
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
          <div className="glass-panel" style={{padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h2 className="mb-4">Create New Order</h2>
            {error && <div className="mb-4 text-danger">{error}</div>}
            
            <div className="form-group">
              <label>Select Customer</label>
              <select className="form-control" value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: parseInt(e.target.value)})}>
                <option value="">-- Select Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
                ))}
              </select>
            </div>

            <div className="glass-panel" style={{padding: '1rem', marginBottom: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)'}}>
              <h3 className="mb-4" style={{fontSize: '1.2rem'}}>Add Products</h3>
              <div className="flex gap-2 mb-4">
                <select className="form-control" style={{flex: 2}} value={currentItem.product_id} onChange={e => setCurrentItem({...currentItem, product_id: parseInt(e.target.value)})}>
                  <option value="">-- Select Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock_quantity === 0}>
                      {p.name} - ${p.price} (Stock: {p.stock_quantity})
                    </option>
                  ))}
                </select>
                <input type="number" min="1" className="form-control" style={{flex: 1}} value={currentItem.quantity} onChange={e => setCurrentItem({...currentItem, quantity: parseInt(e.target.value)})} />
                <button type="button" className="btn-primary" onClick={handleAddItem}>Add</button>
              </div>

              {formData.items.length > 0 && (
                <table className="data-table mb-4">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, idx) => {
                      const p = products.find(prod => prod.id == item.product_id);
                      return (
                        <tr key={idx}>
                          <td>{p?.name}</td>
                          <td>{item.quantity}</td>
                          <td>${(p?.price * item.quantity).toFixed(2)}</td>
                          <td>
                            <button type="button" className="btn-danger" style={{padding: '0.2rem'}} onClick={() => handleRemoveItem(idx)}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
              
              <div className="flex-between">
                <strong>Total Amount:</strong>
                <span className="text-accent" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="btn-primary" style={{flex: 1, justifyContent: 'center'}} onClick={handleSubmit}>
                Place Order
              </button>
              <button className="btn-outline" onClick={() => setIsModalOpen(false)} style={{flex: 1}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-panel" style={{padding: '2rem', width: '100%', maxWidth: '500px'}}>
            <h2 className="mb-4">Order Details #{selectedOrder.id}</h2>
            <div className="mb-4">
              <p><strong>Customer:</strong> {customers.find(c => c.id === selectedOrder.customer_id)?.full_name}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
            </div>
            
            <h4 className="mb-2">Items</h4>
            <table className="data-table mb-4">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{products.find(p => p.id === item.product_id)?.name || `Product ID: ${item.product_id}`}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex-between mb-6">
              <strong>Total Amount:</strong>
              <span className="text-accent" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>${selectedOrder.total_amount.toFixed(2)}</span>
            </div>

            <button className="btn-outline" onClick={() => setIsViewModalOpen(false)} style={{width: '100%'}}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
