import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Car } from "@shared/schema";
import { Heart, Loader2, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarGridProps {
  cars: Car[];
  isLoading?: boolean;
  isAdmin?: boolean;
}

export function CarGrid({ cars, isLoading, isAdmin }: CarGridProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cars/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Машина успешно удалена" });
    },
    onError: (error: Error) => {
      toast({
        title: "Не удалось удалить машину",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/cars/${id}/favorite`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Статус избранного обновлен" });
    },
    onError: (error: Error) => {
      toast({
        title: "Не удалось обновить статус избранного",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Машины не найдены
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <Card 
          key={car.id} 
          className="overflow-hidden group transition-transform hover:scale-[1.02] hover:shadow-lg"
        >
          <div className="aspect-video relative">
            <img
              src={car.imageUrl}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
              onClick={() => toggleFavoriteMutation.mutate(car.id)}
              disabled={toggleFavoriteMutation.isPending}
            >
              <Heart 
                className={cn(
                  "h-5 w-5 transition-colors",
                  car.isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
                )} 
              />
            </Button>
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {car.year} {car.make} {car.model}
            </h3>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{car.mileage.toLocaleString()} км</span>
              <span className="font-medium text-primary">
                ${car.price.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {car.description}
            </p>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex gap-2">
            <Link href={`/cars/${car.id}`}>
              <a className="flex-1">
                <Button variant="secondary" className="w-full">
                  Подробнее
                </Button>
              </a>
            </Link>

            {isAdmin && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteMutation.mutate(car.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}