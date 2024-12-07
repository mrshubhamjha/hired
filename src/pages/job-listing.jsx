import { getJobs } from '@/api/apijobs';
import useFetch from "@/hooks/use-fetch";
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import BarLoader from 'react-spinners/BarLoader';
import JobCard from '@/components/job-card.jsx';
import {getCompanies} from '@/api/apiCompanies';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from '@/components/ui/select';
import { State } from 'country-state-city/lib/index';

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

  const { fn: fnCompanies, data: companies = [] } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies(); // Fetch companies
      console.log(companies); // Log the companies array to check if it's populated
    }
  }, [isLoaded]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get('search-query');
    if (query) setSearchQuery(query);
  }

  const clearFilters = () => {
    setSearchQuery('');
    setCompany('');
    setLocation('');
  }

  return (
    <div>
      <h1 className='text-center font-extrabold text-7xl sm:text-8xl tracking-tighter bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent mt-8'>
        Latest Jobs
      </h1>

      {/* filters */}
      <form
        onSubmit={handleSearch}
        className="h-14 flex flex-row w-full gap-2 items-center mb-3 mt-10"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          name="search-query"
          className="h-full flex-1  px-4 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant="secondary">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={company_id} onValueChange={(value) => setCompany(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" value={company_id ? companies.find(company => company.id === company_id)?.name : ''} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button className="sm:w-1/2" variant="destructive" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

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
