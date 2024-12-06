import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
  import { Button } from "./ui/button";
  import { Input } from "./ui/input";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useForm } from "react-hook-form";
  import useFetch from "@/hooks/use-fetch";
  import { addNewCompany } from "@/api/apiCompanies";
  import { BarLoader } from "react-spinners";
  import { useEffect } from "react";
  import { createClient } from '@supabase/supabase-js';
  
  // Use import.meta.env to access the environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const schema = z.object({
    name: z.string().min(1, { message: "Company name is required" }),
    logo: z
      .any()
      .refine(
        (file) =>
          file[0] &&
          (file[0].type === "image/png" || file[0].type === "image/jpeg"),
        {
          message: "Only Images are allowed",
        }
      ),
  });
  
  const AddCompanyDrawer = ({ fetchCompanies }) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(schema),
    });
  
    const {
      loading: loadingAddCompany,
      error: errorAddCompany,
      data: dataAddCompany,
      fn: fnAddCompany,
    } = useFetch(addNewCompany);
  
    const onSubmit = async (data) => {
      fnAddCompany({
        ...data,
        logo: data.logo[0],
      });
    };
  
    useEffect(() => {
      if (dataAddCompany?.length > 0) {
        fetchCompanies();
      }
    }, [loadingAddCompany]);
  
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button type="button" size="lg" variant="secondary">
            Add Company
          </Button>
        </DrawerTrigger>
        <DrawerContent aria-describedby="company-description">
          <DrawerHeader>
            <DrawerTitle>Add a New Company</DrawerTitle>
          </DrawerHeader>
  
          <form className="flex gap-2 p-4 pb-0">
            {/* Company Name */}
            <Input placeholder="Company name" {...register("name")} />
  
            {/* Company Logo */}
            <Input
              type="file"
              accept="image/*"
              className=" file:text-gray-500"
              {...register("logo")}
            />
  
            {/* Add Button */}
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              variant="destructive"
              className="w-40"
            >
              Add
            </Button>
          </form>
  
          <DrawerFooter>
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
            {errorAddCompany?.message && (
              <p className="text-red-500">{errorAddCompany?.message}</p>
            )}
            {loadingAddCompany && (
              <BarLoader className="mt-4 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-500 h-1" />
            )}
            <DrawerClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
  
          {/* Accessible description for screen readers */}
          <div id="company-description" className="sr-only">
            Provide a company name and logo to add a new company to the list.
          </div>
        </DrawerContent>
      </Drawer>
    );
  };
  
  export default AddCompanyDrawer;
  