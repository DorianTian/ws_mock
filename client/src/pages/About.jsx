function About() {
  return (
    <>
      <h2>关于我们</h2>
      <div className="card">
        <p>这是一个使用 Vite、React 和 Koa 构建的全栈应用示例。</p>
        <p>该应用展示了如何：</p>
        <ul className="feature-list">
          <li>使用 React Router 实现前端路由</li>
          <li>组织代码为可维护的文件结构</li>
          <li>通过 API 服务层与后端通信</li>
          <li>使用 Koa 构建模块化的后端 API</li>
        </ul>
      </div>
    </>
  );
}

export default About; 