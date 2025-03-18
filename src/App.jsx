import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Admin_login from './components/Admin-login'
import Admin from './components/admin'
import AdminTeamPage from './components/AdminTeamPage'
import Login from './components/Login'
import Home from './components/Home'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/login' Component = {Login}/>
        <Route path = '/' Component = {Home}/>
        <Route path = '/admin-login' Component={Admin_login}/>
        <Route path = '/admin' Component = {Admin}/>
        <Route path = '/admin/:team_id' Component = {AdminTeamPage}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
