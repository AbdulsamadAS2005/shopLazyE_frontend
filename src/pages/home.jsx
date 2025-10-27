import React from 'react'
import Header from '../components/header'
import TopOfHeader from '../components/TopOfHeader'
import AllCollectionsInHeader from '../components/allCollectionsInHeader'
import NewArrivals from '../components/newArrivals'

export default function Home() {
  return (
    <div>
      <title>SHOP LAZYE</title>
      <TopOfHeader/>
      <Header/>
      <NewArrivals/>
    </div>
  )
}
