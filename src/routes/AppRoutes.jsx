import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Detalhes from "../pages/Detalhes";
import Favoritos from "../pages/Favoritos";

export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/detalhes">Detalhes</Link> |{" "}
          <Link to="/favoritos">Favoritos</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detalhes" element={<Detalhes />} />       {/* sem id */}
          <Route path="/detalhes/:id" element={<Detalhes />} />   {/* com id */}
          <Route path="/favoritos" element={<Favoritos />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
