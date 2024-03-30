import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import { useEffect, useState } from 'react'
import { useAppDispatch } from './store/hooks'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch()

  useEffect(()=>{
    authService.getCurrentUser().then((userData)=>{
      if (userData) dispatch(login({userData}))
      else dispatch(logout())
    }).finally(() => setLoading(false))
  },[dispatch])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between'>
      <div className='w-full block'>
        <Header/>
        <main>
          <Outlet/>
        </main>
      </div>
      <div className='w-full block'>
        <Footer/>
      </div>
    </div>
  ) : null
}

export default App
