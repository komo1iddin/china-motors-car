import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertCarSchema } from "@shared/schema";
import { z } from "zod";

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Authentication required");
  }
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.status(403).send("Admin access required");
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Public car routes
  app.get("/api/cars", async (req, res) => {
    const cars = await storage.getCars();
    res.json(cars);
  });

  app.get("/api/cars/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const car = await storage.getCar(id);
    if (!car) return res.status(404).send("Car not found");
    res.json(car);
  });

  // Favorite routes
  app.post("/api/cars/:id/favorite", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const car = await storage.getCar(id);
    if (!car) return res.status(404).send("Car not found");

    await storage.toggleFavorite(id);
    const updatedCar = await storage.getCar(id);
    res.json(updatedCar);
  });

  // Admin car routes
  app.post("/api/cars", requireAdmin, async (req, res) => {
    const car = insertCarSchema.parse(req.body);
    const newCar = await storage.createCar(car);
    res.status(201).json(newCar);
  });

  app.patch("/api/cars/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const updates = insertCarSchema.partial().parse(req.body);
    const updatedCar = await storage.updateCar(id, updates);
    res.json(updatedCar);
  });

  app.delete("/api/cars/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteCar(id);
    res.sendStatus(200);
  });

  const httpServer = createServer(app);
  return httpServer;
}