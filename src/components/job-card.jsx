import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Trash2Icon, MapPinIcon, Heart } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';
import useFetch from '@/hooks/use-fetch';
import { saveJob, deleteJob } from '@/api/apijobs';

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
  onRemoveJob = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit || false);
  const { fn: fnSavedJob, loading: loadingSavedJob } = useFetch(saveJob);
  const { user } = useUser();

  const handleSaveJob = async () => {
    setSaved(!saved);
    try {
      await fnSavedJob({
        user_id: user.id,
        job_id: job.id,
      });
      onJobSaved(saved);
    } catch (error) {
      setSaved(saved);
      console.error('Error saving job:', error);
    }
  };

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobSaved();
  };

  useEffect(() => {
    setSaved(savedInit);
  }, [savedInit]);

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
              onClick={handleDeleteJob}
              aria-label="Remove job"
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
              <Heart size={20} fill="red" stroke="red" aria-label="Unsave job" />
            ) : (
              <Heart size={20} aria-label="Save job" />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
