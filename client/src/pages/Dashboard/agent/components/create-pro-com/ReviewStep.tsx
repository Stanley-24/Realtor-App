// src/pages/Dashboard/agent/components/ReviewStep.tsx
type FormValues = {
  title: string;
  description: string;
  location: string;
  type: string;
  status: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  isFeatured: boolean;
};

type Props = {
  values: FormValues;
  images: File[];
};

export default function ReviewStep({ values, images }: Props) {
  return (
    <div className="space-y-8">
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Property Details</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Title</dt>
            <dd className="font-medium">{values.title}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Location</dt>
            <dd className="font-medium">{values.location}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Type</dt>
            <dd className="font-medium">{values.type}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium">{values.status}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Price</dt>
            <dd className="font-medium">₦{values.price.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Featured</dt>
            <dd className="font-medium">{values.isFeatured ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Bedrooms</dt>
            <dd className="font-medium">{values.bedrooms}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Bathrooms</dt>
            <dd className="font-medium">{values.bathrooms}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-muted-foreground">Square Footage</dt>
            <dd className="font-medium">{values.squareFootage} sq ft</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-muted-foreground">Description</dt>
            <dd className="font-medium mt-1">{values.description}</dd>
          </div>
        </dl>
      </div>

      {images.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Images ({images.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt={`Review ${i + 1}`}
                className="rounded-lg object-cover w-full h-40"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}