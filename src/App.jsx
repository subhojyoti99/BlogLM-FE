import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Blogs from "./components/Blogs.jsx"; // make sure this path matches your project
import Header from "./components/Header.jsx";
import BlogDetail from "./components/BlogDetail.jsx";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Common Header for all pages */}
        <Header />

        {/* Page Routes */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id/:blogType" element={<BlogDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
