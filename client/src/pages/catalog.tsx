import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { CarGrid } from "../components/car-grid";
import { Car } from "@shared/schema";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// Sample data remains the same
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
    status: "available",
    isFavorite: false // Added isFavorite field
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
    status: "available",
    isFavorite: false // Added isFavorite field
  },
  // ... other sample cars remain the same
];

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [yearRange, setYearRange] = useState([2000, 2025]); //Added year filter
  const [mileageRange, setMileageRange] = useState([0, 100000]); //Added mileage filter
  const [favoritesOnly, setFavoritesOnly] = useState(false); // Added favorites filter

  const { data: apiCars = [], isLoading } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  // Use sample data if API returns empty array
  const cars = apiCars.length > 0 ? apiCars : sampleCars;

  const filteredCars = cars.filter(car =>
    (car.make.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase())) &&
    car.price >= priceRange[0] &&
    car.price <= priceRange[1] &&
    car.year >= yearRange[0] &&
    car.year <= yearRange[1] &&
    car.mileage >= mileageRange[0] &&
    car.mileage <= mileageRange[1] &&
    (!favoritesOnly || car.isFavorite) //Apply favorites filter
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Каталог автомобилей</h1>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Фильтры</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-6">
              <div className="space-y-2">
                <Label>Цена</Label>
                <Slider
                  min={0}
                  max={50000}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2"> {/*Added Year filter*/}
                <Label>Год выпуска</Label>
                <Slider
                  min={2000}
                  max={2025}
                  step={1}
                  value={yearRange}
                  onValueChange={setYearRange}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>
              <div className="space-y-2"> {/*Added Mileage filter*/}
                <Label>Пробег</Label>
                <Slider
                  min={0}
                  max={100000}
                  step={1000}
                  value={mileageRange}
                  onValueChange={setMileageRange}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{mileageRange[0].toLocaleString()}</span>
                  <span>{mileageRange[1].toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2"> {/*Added Favorites filter*/}
                <Label>Только избранное</Label>
                <input type="checkbox" checked={favoritesOnly} onChange={(e) => setFavoritesOnly(e.target.checked)}/>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid lg:grid-cols-[250px,1fr] gap-8">
        <div className="hidden lg:block space-y-6">
          <div className="space-y-2">
            <Label>Цена</Label>
            <Slider
              min={0}
              max={50000}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
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
      </div>
    </div>
  );
}