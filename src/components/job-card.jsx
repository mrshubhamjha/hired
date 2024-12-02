import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Trash2Icon, MapPinIcon, Link, Heart } from 'lucide-react'; // Make sure the Trash2Icon is imported
import { useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';
import useFetch from '@/hooks/use-fetch';
import { saveJob } from '@/api/apijobs';


const JobCard = ({
  job,
  isMyJob = false,
  SavedInit = false,
  onJobSaved = () => {},
}) => {
    const { fn: fnSavedJobs, data: savedJob = [], loading: loadingSavedJob } = useFetch(saveJob);
  const { user } = useUser(); // Correctly use the hook outside of the return

  const handleSaveJob=async()=>{
    await fnSavedJob({
           user_id: user.id,
        job_id:job.id,
    });
    onJobSaved();
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between font-bold">
            {job.title}

            {!isMyJob && (
              <Trash2Icon
                fill="red" // Set color to red
                size={24}  // Increase size of the icon
                className="cursor-pointer text-red-600 hover:text-red-800 transition-colors"
                onClick={() => onJobSaved(job)} // Handler for click event
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4 flex-1'>
            <div className='flex justify-between'>
                {job.company && <img src={job.company.logo_url} className='h-6' alt={job.company.name} />}
                <div className='flex gap-2 items-center'>
                    <MapPinIcon size={15} /> {job.location}
                </div>
            </div>
            <hr />
            <div className="text-lg font-medium">
            {job.description && job.description.substring(0, job.description.indexOf('.'))}</div>
        </CardContent>
        <CardFooter className="w-full flex justify-center items-center mt-4 px-4">
          {/* Wrap the button inside an anchor tag */}
          <a href={job.link} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="secondary" className="w-full">
              View Job
            </Button>
          </a>
          {!isMyJob&&(
            <Button 
            variant="none" 
            className="w-15 hover:scale-110 transition-transform p-4"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            <Heart 
              size={50} 
              stroke="red" 
              fill="red" 
              className="p-0 m-0"
            />
          </Button>
          
            
          )}

        </CardFooter>

      </Card>
    </div>
  );
};

export default JobCard;
