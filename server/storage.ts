import { type InsertUser, type User, type Car, type InsertCar } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCars(): Promise<Car[]>;
  getCar(id: number): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, car: Partial<Car>): Promise<Car>;
  deleteCar(id: number): Promise<void>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cars: Map<number, Car>;
  private currentUserId: number;
  private currentCarId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.currentUserId = 1;
    this.currentCarId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  async getCars(): Promise<Car[]> {
    return Array.from(this.cars.values());
  }

  async getCar(id: number): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async createCar(car: InsertCar): Promise<Car> {
    const id = this.currentCarId++;
    const newCar: Car = { ...car, id, status: "available" };
    this.cars.set(id, newCar);
    return newCar;
  }

  async updateCar(id: number, updates: Partial<Car>): Promise<Car> {
    const car = await this.getCar(id);
    if (!car) throw new Error("Car not found");
    
    const updatedCar = { ...car, ...updates };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }

  async deleteCar(id: number): Promise<void> {
    this.cars.delete(id);
  }
}

export const storage = new MemStorage();
