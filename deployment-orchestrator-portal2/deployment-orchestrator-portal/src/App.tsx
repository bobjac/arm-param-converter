import React from 'react';
import { AppHeader } from './components/header';
import { Dashboard } from './components/Dashboard';
import { DeploymentConstants } from './constants/deployment.constants';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DeploymentError } from './components/DeploymentError';
import { Redeploy } from './components/Redeploy';
//import './App.css';

const getDefaultRoute = (): string => {
  return `/dashboard/${DeploymentConstants.defaultResourceGroup}/${DeploymentConstants.defaultDeploymentName}`;
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppHeader/>
        <Routes>
          <Route path="" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Navigate to={getDefaultRoute()} />} />
          <Route path="dashboard/:deploymentName/:deploymentResourceGroup" element={<Dashboard/> } />
          <Route path="/deploymenterror" element={<DeploymentError />} />
          <Route path="/redeploy/:deploymentName/:deploymentResourceGroup" element={<Redeploy />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
