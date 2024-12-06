import useFetch from '@/hooks/use-fetch';
import React, { useEffect } from 'react';
import { getSavedJobs } from '@/api/apijobs';
import { useUser } from "@clerk/clerk-react";
import BarLoader from 'react-spinners/BarLoader';
import JobCard from '@/components/job-card';

const SavedJobs = () => {
  const { isLoaded } = useUser();
  const {
    loading: loadingSavedJobs,
    data: savedJobs = [],
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded]);

  return (
    <div>
      <h1 className='text-center font-extrabold text-7xl sm:text-8xl tracking-tighter bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent mt-8'>
        Saved Jobs
      </h1>

      {loadingSavedJobs && (
        <div className="mt-4 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 h-1">
          <BarLoader className="w-full" width="100%" color="transparent" />
        </div>
      )}

      {loadingSavedJobs === false && (
        <div className='mt-9 flex flex-col gap-3 px-2'>
          {savedJobs?.length ? (
            savedJobs.map((saved) => (
              <JobCard
                key={saved.id}
                job={saved.job}
                savedInit={true}
                onJobSaved={fnSavedJobs}
              />
            ))
          ) : (
            <div>No Saved Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;