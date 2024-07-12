import { useContext, useState } from 'react'
import { Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserContext from './components/context/UserContext'
import MotherScreen from './components/MotherScreen';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ViewEntry from './components/ViewEntry';
import ViewAllEntryScreen from './components/ViewAllEntryScreen';
import AddEntryScreen from './components/AddEntryScreen';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
function App() {
  const {isLoggedIn} = useContext(UserContext);
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<MotherScreen/>}>
          <Route index element={<div className='content'><Dashboard/></div>}></Route>
          <Route path='/login' element={<div className='content fullHeight'><LoginScreen/></div>}></Route>
          <Route path='/signup' element={<div className='content fullHeight'><RegisterScreen/></div>}></Route>
          <Route path='/viewEntry/:id' element={<div className='content fullHeight'><ViewEntry/></div>}></Route>
          <Route path='/allEntries' element={<div className='content fullHeight'><ViewAllEntryScreen/></div>}></Route>
          <Route path='/addEntry' element={<div className='content fullHeight'><AddEntryScreen/></div>}></Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App
