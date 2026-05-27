import { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react';
import { getProducts, getCustomers, getOrders } from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    lowStock: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, customersRes, ordersRes] = await Promise.all([
          getProducts(),
          getCustomers(),
          getOrders()
        ]);

        const products = productsRes.data;
        const lowStockProducts = products.filter(p => p.stock_quantity < 10).length;

        setStats({
          products: products.length,
          customers: customersRes.data.length,
          orders: ordersRes.data.length,
          lowStock: lowStockProducts
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      <h1>Dashboard</h1>
      <p className="mb-6" style={{color: 'var(--text-secondary)'}}>Welcome back! Here's an overview of your inventory system.</p>

      <div className="grid grid-cols-4">
        <div className="glass-panel stat-card">
          <div className="stat-title">
            Total Products
            <Package size={20} color="var(--accent)" />
          </div>
          <div className="stat-value">{stats.products}</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-title">
            Total Customers
            <Users size={20} color="var(--success)" />
          </div>
          <div className="stat-value">{stats.customers}</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-title">
            Total Orders
            <ShoppingCart size={20} color="var(--warning)" />
          </div>
          <div className="stat-value">{stats.orders}</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-title">
            Low Stock Alerts
            <AlertTriangle size={20} color="var(--danger)" />
          </div>
          <div className="stat-value text-danger">{stats.lowStock}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
