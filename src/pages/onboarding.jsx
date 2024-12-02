import React, { useEffect } from 'react'
import {BarLoader} from 'react-spinners';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const Onboarding = () => {
const {user, isLoaded}=useUser();
const navigate=useNavigate();

const handleRoleSelection=async(role)=>{
  await user.update({
    unsafeMetadata:{ role },
  }).then(()=>{
    navigate(role==='recruiter'?'/post-job':'/jobs')
  }).catch((err)=>{
    console.log('Error updating role:',err)
  });
}

useEffect(() => {
  if (user?.unsafeMetadata?.role) {
    navigate(user?.unsafeMetadata?.role === 'recruiter' ? '/post-job' : '/jobs');
  }
}, [user]); // Add user as a dependency

  if(!isLoaded){
    return <BarLoader className='mb-4' width={'100%'} color='#36d7b7'/>
  }

  return (
    <div className='flex flex-col items-center justify-center mt-32'>
     <h2 className="text-center font-extrabold text-7xl sm:text-8xl tracking-tighter bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
        I am a ...
      </h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
        <Button className='h-36 text-2xl'
        onClick={()=> handleRoleSelection('candidate')}>
          Candidate
        </Button>
        <Button variant ='destructive' className='h-36 text-2xl' onClick={()=> handleRoleSelection('recruiter')}>
          Recruiter
        </Button>
      </div>
      </div>
  )
}

export default Onboarding;