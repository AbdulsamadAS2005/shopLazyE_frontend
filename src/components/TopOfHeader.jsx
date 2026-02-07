import React, { useEffect, useState } from 'react'
const apiURL = import.meta.env.VITE_Backend;

export default function TopOfHeader() {

  let [top,setTop]=useState()

  useEffect(()=>{
    handleTopOfHeader();
  },[])


  let handleTopOfHeader=async()=>{
    let response=await fetch(`${apiURL}/getLatest`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      }
    })
    let data=await response.json()
    setTop(top=data[0].Latest)
    
    
  }

  return (
    <>
    {
      top?
      <div style={{height:"30px",display:"flex",alignItems:'center',backgroundColor:"white"}}>
        <marquee scrollAmount="10">{top}</marquee>
      </div>
      :
      ""
    }
    </>
  )
}
