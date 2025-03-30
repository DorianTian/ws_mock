import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h2>404 - 页面不存在</h2>
      <p>您访问的页面不存在或已被移除。</p>
      <Link to="/" className="home-link">返回首页</Link>
    </div>
  );
}

export default NotFound; 