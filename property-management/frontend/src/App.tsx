

import { Routes, Route, Navigate } from "react-router-dom";
import {Navbar} from "./components/layout/Navbar";
import Properties from "./pages/Properties";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PropertyDetails from "./pages/PropertyDetail";
import AddProperty from "./pages/AddProperty";
import { AdminRoute } from "./routes/AdminRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ScrollToTop from "./components/layout/ScrollToTop";





export default function App() {
  return (

    <>
   <Navbar/>   
    <ScrollToTop/> 
    <Routes>
      {/* Default landing page */}
      <Route path="/" element={<Navigate to="/properties" replace />} />

        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


      {/* Admin-only add property page */}
      <Route
        path="/properties/add"
        element={
          <AdminRoute>
            <AddProperty />
          </AdminRoute>
        }
      />


      {/* Optional: catch all */}
      <Route path="*" element={<Navigate to="/properties" replace />} />

   
    </Routes>

       </>
         
          

   
  );
}

