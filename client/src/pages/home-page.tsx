import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { CarGrid } from "@/components/car-grid";
import { Car } from "@shared/schema";
import { Search } from "lucide-react";

// Sample data
const sampleCars: Car[] = [
  {
    id: 1,
    make: "BYD",
    model: "Han",
    year: 2024,
    price: 35000,
    mileage: 0,
    description: "Новый электрический седан премиум класса",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    status: "available"
  },
  {
    id: 2,
    make: "Geely",
    model: "Coolray",
    year: 2024,
    price: 25000,
    mileage: 0,
    description: "Стильный компактный кроссовер",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    status: "available"
  },
  {
    id: 3,
    make: "Chery",
    model: "Tiggo 8 Pro",
    year: 2024,
    price: 32000,
    mileage: 0,
    description: "Семейный SUV с богатым оснащением",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    status: "available"
  },
  {
    id: 4,
    make: "Great Wall",
    model: "Haval H6",
    year: 2024,
    price: 28000,
    mileage: 0,
    description: "Комфортный городской кроссовер",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    status: "available"
  },
  {
    id: 5,
    make: "FAW",
    model: "Bestune T77",
    year: 2024,
    price: 26000,
    mileage: 0,
    description: "Современный кроссовер с передовыми технологиями",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    status: "available"
  },
  {
    id: 6,
    make: "SAIC",
    model: "MG HS",
    year: 2024,
    price: 27000,
    mileage: 0,
    description: "Элегантный и практичный SUV",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    status: "available"
  },
  {
    id: 7,
    make: "BYD",
    model: "Tang",
    year: 2024,
    price: 38000,
    mileage: 0,
    description: "Мощный электрический SUV",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    status: "available"
  },
  {
    id: 8,
    make: "Geely",
    model: "Tugella",
    year: 2024,
    price: 33000,
    mileage: 0,
    description: "Премиальный спортивный кроссовер",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    status: "available"
  },
  {
    id: 9,
    make: "Chery",
    model: "Arrizo 8",
    year: 2024,
    price: 29000,
    mileage: 0,
    description: "Бизнес седан с современным дизайном",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    status: "available"
  },
  {
    id: 10,
    make: "Hongqi",
    model: "H9",
    year: 2024,
    price: 45000,
    mileage: 0,
    description: "Люксовый седан представительского класса",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    status: "available"
  }
];

export default function HomePage() {
  const [search, setSearch] = useState("");

  const { data: cars = sampleCars, isLoading } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  const filteredCars = cars.filter(car => 
    car.make.toLowerCase().includes(search.toLowerCase()) ||
    car.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
          Найдите автомобиль своей мечты
        </h1>
        <p className="text-lg text-muted-foreground">
          Широкий выбор премиальных автомобилей из Китая
        </p>
      </div>

      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Поиск по марке или модели..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <CarGrid cars={filteredCars} isLoading={isLoading} />
    </div>
  );
}