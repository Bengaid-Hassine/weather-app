import React from 'react'
import './LoaderSpinner.css';
import GridLoader from "react-spinners/GridLoader";

export default function LoaderSpinner({isLoading}) {
  return (
    <div className='loader-container'>
      <GridLoader
        color="#3eeaf1"
        size={10}
        loading={isLoading}
        className="loader"
      />
      <p>Searching city...</p>
    </div>
  )
}
