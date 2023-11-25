import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./pages/Create";
import Display from "./pages/Display";
import Edit from "./pages/Edit";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Display />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
