import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CarForm } from "@/components/car-form";
import { useAuth } from "@/hooks/use-auth";
import { Car } from "@shared/schema";
import { Edit, Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

export default function CarDetails() {
  const [, params] = useRoute("/cars/:id");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: car, isLoading } = useQuery<Car>({
    queryKey: [`/api/cars/${params?.id}`],
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/cars/${params?.id}/favorite`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cars/${params?.id}`] });
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

  if (!car) {
    return <div>Машина не найдена</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {car.year} {car.make} {car.model}
        </h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleFavoriteMutation.mutate()}
            disabled={toggleFavoriteMutation.isPending}
            className={cn(car.isFavorite && "bg-red-50")}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-colors",
                car.isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
              )} 
            />
          </Button>

          {user?.isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Редактировать информацию</DialogTitle>
                </DialogHeader>
                <CarForm car={car} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
        <img 
          src={car.imageUrl} 
          alt={`${car.year} ${car.make} ${car.model}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />
      </div>

      <Card>
        <CardContent className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Характеристики</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Марка:</dt>
                <dd className="font-medium">{car.make}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Модель:</dt>
                <dd className="font-medium">{car.model}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Год:</dt>
                <dd className="font-medium">{car.year}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Пробег:</dt>
                <dd className="font-medium">{car.mileage.toLocaleString()} км</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Цена и статус</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Цена:</dt>
                <dd className="font-medium text-lg text-primary">
                  ${car.price.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Статус:</dt>
                <dd className="font-medium capitalize">{car.status === 'available' ? 'В наличии' : 'Продано'}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      <div className="prose prose-gray max-w-none">
        <h2 className="text-lg font-semibold mb-4">Описание</h2>
        <p className="text-muted-foreground whitespace-pre-line">
          {car.description}
        </p>
      </div>
    </div>
  );
}