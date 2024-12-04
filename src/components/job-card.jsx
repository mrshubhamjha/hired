import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Trash2Icon, MapPinIcon, Heart } from 'lucide-react'; // Icons
import { useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';
import useFetch from '@/hooks/use-fetch';
import { saveJob } from '@/api/apijobs';

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { fn: fnSavedJob, data: savedJob = [], loading: loadingSavedJob } = useFetch(saveJob, { alreadySaved: saved });
  const { user } = useUser();

  // Handle saving or unsaving the job
  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    setSaved(!saved); // Toggle the saved state
    onJobSaved(); // Trigger parent callback if needed
  };

  useEffect(() => {
    // Update saved state based on savedJob data
    if (savedJob !== undefined) {
      setSaved(savedJob?.length > 0);
    }
  }, [savedJob]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {!isMyJob && (
            <Trash2Icon
              fill="red"
              size={24}
              className="cursor-pointer text-red-600 hover:text-red-800 transition-colors"
              onClick={() => onJobSaved(job)} // Handler for click event (assuming this is to remove a job from list)
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {job.company && <img src={job.company.logo_url} className="h-6" alt={job.company.name} />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        <div className="text-lg font-medium">
          {job.description && job.description.substring(0, job.description.indexOf('.'))}
        </div>
      </CardContent>
      <CardFooter className="w-full flex justify-center items-center mt-4 px-4">
        <a href={job.link} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="secondary" className="w-full">
            View Job
          </Button>
        </a>
        {!isMyJob && (
          <Button
            variant="none"
            className="w-15 hover:scale-110 transition-transform p-4"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
