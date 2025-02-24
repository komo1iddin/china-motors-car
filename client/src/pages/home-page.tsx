import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { CarGrid } from "@/components/car-grid";
import { Car } from "@shared/schema";
import { Search } from "lucide-react";

export default function HomePage() {
  const [search, setSearch] = useState("");
  
  const { data: cars = [], isLoading } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  const filteredCars = cars.filter(car => 
    car.make.toLowerCase().includes(search.toLowerCase()) ||
    car.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Find Your Dream Car
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse our extensive collection of premium vehicles
        </p>
      </div>

      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search by make or model..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <CarGrid cars={filteredCars} isLoading={isLoading} />
    </div>
  );
}
