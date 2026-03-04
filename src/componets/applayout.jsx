import React from 'react'
import {Footer }from './footer'
import { Header } from './header'
import { Outlet, useLocation } from 'react-router-dom'

const Applayout = () => {
  const location = useLocation();
  const hideRoutes = [
    '/login',
    '/signup',  
  ]
  const shouldHideHeaderFooter = hideRoutes.includes(location.pathname);
  return (
    <div className=''>
        {!shouldHideHeaderFooter && <Header/>}
        <div className={shouldHideHeaderFooter?"":''}>
        <Outlet/>
        </div>
        {!shouldHideHeaderFooter && <Footer/>}
    </div>
  )
}

export default Applayout