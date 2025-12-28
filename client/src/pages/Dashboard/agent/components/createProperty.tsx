// src/pages/Dashboard/agent/CreateProperty.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import CreatePropertyForm from "./create-pro-com/CreatePropertyForm";

const steps = [
  { 
    id: 1, 
    name: "Basic Info", 
    desc:  "Enter your property name, description, property type, status, price and location"
  },
  { 
    id: 2, 
    name: "Details",
    desc: "Enter the numbers of bathroom, bedroom and the size in square foot, also mark as feature to get our free adds"
  },
  { 
    id: 3, 
    name: "Images",
    desc: "Upload a new picture of your property to gain more viewer"
  },
  { 
    id: 4, 
    name: "Review", 
    desc: "Review your property before publishing, use the button below to publish" 
  },
];

export default function CreatePropertyPage() {
  return (
    <div className="w-full flex justify-center py-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">
          Create New Property Listing
        </h1>

        <CreatePropertyForm steps={steps}>
          {({ currentStep }) => (
            <>
              {/* Progress Bar */}
              <div className="mb-10">
                <Progress
                  value={((currentStep + 1) / steps.length) * 100}
                  className="h-2"
                />
                <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                  {steps.map((step, i) => (
                    <span
                      key={step.id}
                      className={i === currentStep ? "font-medium text-foreground" : ""}
                    >
                      {step.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Form Card */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Step {currentStep + 1}: {steps[currentStep].name}
                  </CardTitle>
                  <CardDescription>
                    {steps[currentStep].desc}
                  </CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </>
          )}
        </CreatePropertyForm>
      </div>
    </div>
  );
}
