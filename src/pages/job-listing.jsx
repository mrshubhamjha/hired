import { getJobs } from '@/api/apijobs';
import useFetch from "@/hooks/use-fetch";
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import BarLoader from 'react-spinners/BarLoader';
import JobCard from '@/components/job-card.jsx';

const Joblisting = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany] = useState("");
  const { isLoaded } = useUser();

  const { fn: fnJobs, data: jobs = [], loading: loadingJobs } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  return (
    <div>
      <h1 className='text-center font-extrabold text-7xl sm:text-8xl tracking-tighter bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent mt-8'>
        Latest Jobs
      </h1>

      {loadingJobs && (
        <div className="mt-4 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 h-1">
          <BarLoader className="w-full" width="100%" color="transparent" />
        </div>
      )}
      {loadingJobs === false && (
        <div className='mt-9 flex flex-col gap-3 px-2'>
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Joblisting;
