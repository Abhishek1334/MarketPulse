import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const BackButton = ( { locationAddress, locationName } ) => {

	const navigate = useNavigate()
	// if no locationAddress is provided, navigate to the previous page 
	return (
		<div
			onClick={() => locationAddress ? navigate(locationAddress) : navigate(-1)}
			className="cursor-pointer bg-[var(--background-950)] shadow-md rounded-2xl text-[var(--text-50)] py-2 w-[fit-content] px-5 text-sm font-semibold flex items-center gap-2 hover:bg-[var(--background-700)] hover:text-[var(--text-100)] transition-all duration-200 ease-in-out"
		>
			<ArrowLeft size={16}/>
			{locationName ? locationName : "Back"}
		</div>
	);
}

export default BackButton