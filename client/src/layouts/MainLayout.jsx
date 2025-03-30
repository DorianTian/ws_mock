import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
  return (
    <div className="container">
      <h1>Vite + React + Koa 全栈应用</h1>
      
      <nav className="navigation">
        <ul>
          <li><Link to="/">首页</Link></li>
          <li><Link to="/about">关于</Link></li>
        </ul>
      </nav>
      
      <div className="content">
        {children}
      </div>
      
      <p className="footer">
        使用 Vite 构建的 React 应用，连接到重构的 Koa 后端
      </p>
    </div>
  );
};

export default MainLayout; 