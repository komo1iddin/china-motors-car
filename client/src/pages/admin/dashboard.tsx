import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CarForm } from "@/components/car-form";
import { CarGrid } from "@/components/car-grid";
import { Car } from "@shared/schema";
import { Plus } from "lucide-react";

export default function AdminDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: cars = [], isLoading } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Car Management</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Car
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Car</DialogTitle>
            </DialogHeader>
            <CarForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <CarGrid 
        cars={cars} 
        isLoading={isLoading} 
        isAdmin 
      />
    </div>
  );
}
