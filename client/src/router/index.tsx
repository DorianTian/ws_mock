import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import routes from './routes';
import React from 'react';

// Define route type
interface RouteItem {
  path: string;
  element: React.ComponentType;
  exact?: boolean;
  children?: RouteItem[];
}

// 递归渲染路由
const renderRoutes = (routes: RouteItem[]) => {
  return routes.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={<route.element />}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    
    return (
      <Route 
        key={index} 
        path={route.path} 
        element={<route.element />}
      />
    );
  });
};

const AppRouter = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {renderRoutes(routes)}
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRouter; 