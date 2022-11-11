import React from 'react'
import withAuth from '../../src/auth'
import Dashboard from '../../src/components/Dashboard'
import NavBar from '../../src/components/NavBar'
import Page from '../../src/components/Page'

function index() {
  return (
    <>
    <NavBar/>
    <Dashboard/>
    {/* <Page/> */}
    </>
  )
}

export default withAuth(index)