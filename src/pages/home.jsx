import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import TopOfHeader from '../components/TopOfHeader'
import AllCollectionsInHeader from '../components/allCollectionsInHeader'
import NewArrivals from '../components/newArrivals'
import BestSeller from '../components/bestSellers'
import SummerCollection from '../components/summer'
import WinterCollection from '../components/winter'
import UpperFooter from '../components/upperFooter'
import Footer from '../components/footer'
const apiURL = import.meta.env.VITE_Backend;

export default function Home() {

  let [collection, setCollection] = useState()

  useEffect(() => {
    checkSeason();
  }, [])

  let checkSeason = async () => {
    try {
      let response = await fetch(`${apiURL}/getLatest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      let data = await response.json()
      if (data) {
        setCollection(collection = data[0].CollectionToShowOnHome)

      }

    } catch (error) {

    }
  }

  return (
    <div>
      <title>SHOP LAZYE</title>
      <TopOfHeader />
      <Header />
      <NewArrivals />
      <BestSeller />
      {
        collection == "Summer" ?
          <SummerCollection />
          :
          collection == "Winter" ?
            <WinterCollection />
            :
            <SummerCollection />
      }
      <UpperFooter/>
      <Footer/>
    </div>
  )
}
