import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CarForm } from "@/components/car-form";
import { useAuth } from "@/hooks/use-auth";
import { Car } from "@shared/schema";
import { Edit, Loader2 } from "lucide-react";

export default function CarDetails() {
  const [, params] = useRoute("/cars/:id");
  const { user } = useAuth();
  
  const { data: car, isLoading } = useQuery<Car>({
    queryKey: [`/api/cars/${params?.id}`],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {car.year} {car.make} {car.model}
        </h1>
        
        {user?.isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Car
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Car</DialogTitle>
              </DialogHeader>
              <CarForm car={car} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <img 
          src={car.imageUrl} 
          alt={`${car.year} ${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
      </div>

      <Card>
        <CardContent className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Vehicle Details</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Make:</dt>
                <dd className="font-medium">{car.make}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Model:</dt>
                <dd className="font-medium">{car.model}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Year:</dt>
                <dd className="font-medium">{car.year}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Mileage:</dt>
                <dd className="font-medium">{car.mileage.toLocaleString()} miles</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Price & Status</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Price:</dt>
                <dd className="font-medium text-lg text-primary">
                  ${car.price.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status:</dt>
                <dd className="font-medium capitalize">{car.status}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      <div className="prose prose-gray max-w-none">
        <h2 className="text-lg font-semibold mb-4">Description</h2>
        <p className="text-muted-foreground whitespace-pre-line">
          {car.description}
        </p>
      </div>
    </div>
  );
}
