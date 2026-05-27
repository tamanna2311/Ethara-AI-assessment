import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Package className="icon" size={28} />
        <span>InventoryOS</span>
      </div>
      
      <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/products" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Package size={20} />
          Products
        </NavLink>
        <NavLink to="/customers" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          Customers
        </NavLink>
        <NavLink to="/orders" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <ShoppingCart size={20} />
          Orders
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
