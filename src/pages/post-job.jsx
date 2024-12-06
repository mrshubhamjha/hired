import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from '@/components/ui/select';
import { State } from 'country-state-city';
import { useUser } from '@clerk/clerk-react';
import useFetch from '@/hooks/use-fetch';
import { getCompanies } from '@/api/apiCompanies';
import { Navigate, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { addNewJob } from '@/api/apijobs';
import BarLoader from 'react-spinners/BarLoader';
import AddComapnyDrawer from '../components/add-company-drawer';

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a Location" }),
  company_id: z.string().min(1, { message: "Select or Add a new company" }),
  link: z.string().min(1, { message: "Link is required" }),
});

const PostJob = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm({
    defaultValues: {
      location: '',
      company_id: '',
      description: '', // No default description
    },
    resolver: zodResolver(schema),
  });

  const { fn: fnCompanies, data: companies, loading: loadingCompanies } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (Array.isArray(dataCreateJob) && dataCreateJob.length > 0) {
      navigate('/jobs');
    }
  }, [dataCreateJob]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Optional loading indicator while user data is being fetched
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to='/jobs' />;
  }

  const handleDescriptionChange = (value) => {
    setValue('description', value);
  };

  return (
    <div>
      <h1 className='text-center font-extrabold text-7xl sm:text-8xl tracking-tighter bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent mt-5'>Post a Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0 mt-4'>
        <Input placeholder='Job Title' {...register('title')} />
        {errors.title && <p className='text-red-500'>{errors.title.message}</p>}

        <p className=' font-bold text-3xl sm:text-4xl tracking-tighter bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent'>
          Description
        </p>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <MDEditor
              value={field.value}
              onChange={handleDescriptionChange}
              preview="edit"
              height={210}
              placeholder="Write job description here in Markdown format"
            />
          )}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <div className='flex gap-4 items-center'>
          <Controller
            name='location'
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
            )}
          />
          <Controller
            name='company_id'
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))?.name
                      : "Company"}
                  </SelectValue>
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
            )}
          />
          <AddComapnyDrawer fetchCompanies={fnCompanies}/>
        </div>
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
        {errors.company_id && <p className="text-red-500">{errors.company_id.message}</p>}

        <Input placeholder='Job Link' {...register('link')} />
        {errors.link && <p className='text-red-500'>{errors.link.message}</p>}

        {loadingCreateJob && <BarLoader className="mt-4 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 h-1" width={'100%'} color='transparent' />}

        <Button type='submit' variant='secondary' size='lg' className='mt-2'>Submit</Button>
      </form>
    </div>
  );
};

export default PostJob;
