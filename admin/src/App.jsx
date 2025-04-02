import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './componets/PrivateRoute';
import Sidebar from './componets/SideBar';
import Navbar from './componets/Navbar';
import Dashboards from './pages/Dashboards';
import Add from './pages/ProductAdd';
import List from './pages/ProductList';
import Client from './pages/ClientAdd';
import ClientList from './pages/ClientList';
import AwardsAdd from './pages/AwardsAdd';
import AwardsList from './pages/AwardsList';
import AdminLogs from './pages/AdminLogs';
import Order from './pages/Order';
import Changepassword from './componets/changepassword';
import Profile from './componets/Profile';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");

  return (
    <div className='min-h-screen'>
      <ToastContainer />
      <BrowserRouter>
        <div className="flex">
          <Sidebar isOpen={isOpen} />
          <div className="flex-1">
            <Navbar setIsOpen={setIsOpen} />
            <Routes>
              <Route path="/" element={token ? <Navigate to="/dashboards" /> : <Login />} />

              <Route path="/dashboards" element={
                <PrivateRoute>
                  <Dashboards />
                </PrivateRoute>
              } />

              <Route path="/add" element={
                <PrivateRoute>
                  <Add />
                </PrivateRoute>
              } />

              <Route path="/list" element={
                <PrivateRoute>
                  <List />
                </PrivateRoute>
              } />

              <Route path="/client" element={
                <PrivateRoute>
                  <Client />
                </PrivateRoute>
              } />

              <Route path="/clientList" element={
                <PrivateRoute>
                  <ClientList />
                </PrivateRoute>
              } />

              <Route path="/awards" element={
                <PrivateRoute>
                  <AwardsAdd />
                </PrivateRoute>
              } />

              <Route path="/awardsList" element={
                <PrivateRoute>
                  <AwardsList />
                </PrivateRoute>
              } />

              <Route path="/order" element={
                <PrivateRoute>
                  <Order />
                </PrivateRoute>
              } />

              <Route path="/changepassword" element={
                <PrivateRoute>
                  <Changepassword />
                </PrivateRoute>
              } />

              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              <Route path="/logs" element={
                <PrivateRoute>
                  <AdminLogs />
                </PrivateRoute>
              } />

            </Routes>
        
          </div>
          
        </div>
       
      </BrowserRouter>
     
    </div>
  );
}

export default App;
