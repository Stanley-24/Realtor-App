// src/pages/Dashboard/agent/components/create-pro-com/createPropertyForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";


import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreatePropertyStore } from "@/store/createPropertyStore";
import { typedZodResolver } from "@/lib/types";

import BasicInfoStep from "./BasicInfoStep";
import DetailsStep from "./DetailsStep";
import ImagesStep from "./ImagesStep";
import ReviewStep from "./ReviewStep";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(3, "You must add a location"),
  type: z.enum(["House", "Apartment", "Land", "Commercial", "Other"]),
  status: z.enum(["Available", "Under Contract", "Sold", "Rented"]),
  price: z.coerce.number().positive("Price must be positive"),
  bedrooms: z.coerce.number().int().min(0), // Allow 0 for studios/land
  bathrooms: z.coerce.number().int().min(0),
  squareFootage: z.coerce.number().positive("Square footage must be positive"),
  isFeatured: z.boolean(),
});

export type FormValues = z.infer<typeof formSchema>;

type Step = { id: number; name: string };
type Props = {
  steps: Step[];
  children: (context: { currentStep: number }) => React.ReactNode;
};

export default function CreatePropertyForm({ steps, children }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<File[]>([]);

  const navigate = useNavigate(); // For redirect

  const { createProperty, isLoading, error, success, reset } = useCreatePropertyStore();

  const form = useForm<FormValues>({
    resolver: typedZodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      location: "",
      type: "House",
      status: "Available",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      squareFootage: 0,
      isFeatured: false,
    },
  });

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
      reset();
    }
  }, [error, reset]);

  // Handle success: show toast ONCE and redirect
  useEffect(() => {
    if (success) {
      toast.success("Property created successfully!");
      form.reset();
      setImages([]);
      setCurrentStep(0);
      reset();

      // Redirect to My Listings page
      navigate("/dashboard/agent/my-listings"); // Adjust path as needed
    }
  }, [success, form, reset, navigate]);

  const getFieldsForStep = (step: number): (keyof FormValues)[] => {
    switch (step) {
      case 0:
        return ["title", "description", "location", "type", "status", "price"];
      case 1:
        return ["bedrooms", "bathrooms", "squareFootage", "isFeatured"];
      case 2:
      case 3:
      default:
        return [];
    }
  };

  const nextStep = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const fields = getFieldsForStep(currentStep);
    const isValid = fields.length > 0 ? await form.trigger(fields) : true;

    // Special validation for Images step
    if (currentStep === 2 && images.length < 2) {
      toast.error("Please upload at least 2 images");
      return;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: FormValues) => {
    
    if (currentStep !== steps.length - 1) {
    return;
  }
    if (images.length < 2) {
      toast.error("You must upload at least 2 images");
      setCurrentStep(2); // Send user back to images step
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    await createProperty(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep />;
      case 1:
        return <DetailsStep />;
      case 2:
        return <ImagesStep images={images} setImages={setImages} />;
      case 3:
        return <ReviewStep values={form.getValues()} images={images} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children({ currentStep })}

        <div className="mt-8">{renderStep()}</div>

        <div className="flex justify-between mt-12 pt-8 border-t">
          <Button
            type="button"
            variant="pinky"
            onClick={prevStep}
            disabled={currentStep === 0}
            aria-label="Previous step button for property listing"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button 
              type="submit" 
              disabled={isLoading} 
              variant="pinky"
              aria-label="Create property listing button"
            >
              {isLoading ? (
                "Creating..."
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Create Property
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              variant="pinky"
              disabled={isLoading}
              aria-label="Next step button for property listing"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}