import React from 'react'
import { useParams } from 'react-router-dom'
const StockPage = () => {
  const { symbol } =  useParams();
  return (
	<div>
    <div>
      <h1>StockPage</h1>
      <p>{symbol}</p>
    </div>
  </div>

  )
}

export default StockPage