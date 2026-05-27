import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', stock_quantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await createProduct(formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', sku: '', price: '', stock_quantity: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openEditModal = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-6">
        <h1>Products</h1>
        <button className="btn-primary" onClick={() => {
          setEditingId(null);
          setFormData({ name: '', sku: '', price: '', stock_quantity: '' });
          setIsModalOpen(true);
        }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="glass-panel" style={{overflowX: 'auto'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock_quantity}</td>
                <td>
                  <span className={`badge ${product.stock_quantity > 10 ? 'badge-success' : product.stock_quantity > 0 ? 'badge-warning' : 'badge-danger'}`}>
                    {product.stock_quantity > 10 ? 'In Stock' : product.stock_quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-outline" style={{padding: '0.4rem'}} onClick={() => openEditModal(product)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-danger" style={{padding: '0.4rem'}} onClick={() => handleDelete(product.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No products found.</td>
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
            <h2 className="mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            {error && <div className="mb-4 text-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input required type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input required type="text" className="form-control" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              </div>
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input required type="number" step="0.01" min="0.01" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input required type="number" min="0" className="form-control" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="flex gap-4" style={{marginTop: '1rem'}}>
                <button type="submit" className="btn-primary" style={{flex: 1, justifyContent: 'center'}}>
                  {editingId ? 'Update' : 'Save'} Product
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

export default Products;
