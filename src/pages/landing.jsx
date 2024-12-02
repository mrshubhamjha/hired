import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import companies from '@/data/companies.json'; // Adjust the path as needed
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import faqs from '@/data/faq.json';
import InfiniteCarousel from '@/components/ui/infinitecarousel';

const LandingPage = () => {
  return (
    <main className="flex flex-col items-center gap-10 sm:gap-20 py-10 sm:py-20">
      {/* Landing Page Header Section */}
      <section className="text-center w-full">
        <h1 className="flex flex-col items-center justify-center text-4xl font-extrabold sm:text-6xl lg:text-8xl mx-auto px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
          Find Your Dream Job and get Onboarded!
        </h1>
        <p className="text-gray-100 sm:mt-6 text-sm sm:text-2xl font-medium">
          Explore Job Opportunities or Hire a Candidate!
        </p>
      </section>

      {/* Buttons for navigation */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/jobs" aria-label="Navigate to Find Jobs page">
          <Button size="lg" variant="secondary" className="font-semibold">
            Find Jobs
          </Button>
        </Link>
        <Link to="/post-job" aria-label="Navigate to Post a Job page">
          <Button size="lg" variant="secondary" className="font-semibold">
            Post a Job
          </Button>
        </Link>
      </div>
      <div className="relative w-full py-10 overflow-hidden">
  {/* Carousel Wrapper with Animation */}
  <div className="carousel-wrap flex gap-5 sm:gap-20 items-center">
    {/* First set of items */}
    {companies.map(({ name, id, path }) => (
      <div key={id} className="carousel-item flex-shrink-0 w-1/3 lg:w-1/6">
        <img src={path} alt={name} className="h-9 sm:h-14 object-contain" />
      </div>
    ))}

    {/* Duplicate the items for seamless loop */}
    {companies.map(({ name, id, path }) => (
      <div key={`duplicate-${id}`} className="carousel-item flex-shrink-0 w-1/3 lg:w-1/6">
        <img src={path} alt={name} className="h-9 sm:h-14 object-contain" />
      </div>
    ))}
  </div>
</div>
 


      {/* Card Section for Job Seekers and Employers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Post jobs, manage applications, and find the best candidates</p>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Accordion Section */}
      <div className="w-full px-4">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`} className="w-full">
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
};

export default LandingPage;
