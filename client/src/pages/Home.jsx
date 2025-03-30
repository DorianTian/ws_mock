import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function Home() {
  const [data, setData] = useState('加载中...');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiService.getTestData();
      setData(result.data.data);
      setTimestamp(result.timestamp);
    } catch (err) {
      console.error('获取数据错误:', err);
      setError('获取数据失败，请确保后端服务器正在运行');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2>首页</h2>
      <div className="card">
        <h2>从后端获取的数据:</h2>
        {isLoading ? (
          <p>加载中...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div>
            <p className="data">{data}</p>
            {timestamp && (
              <p className="timestamp">更新时间: {new Date(timestamp).toLocaleString()}</p>
            )}
          </div>
        )}
        
        <button onClick={fetchData} disabled={isLoading}>
          {isLoading ? '加载中...' : '刷新数据'}
        </button>
      </div>
    </>
  );
}

export default Home; 