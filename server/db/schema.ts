import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  integer,
  date,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Types ----------
export type Detalles = {
  estadoConservacion: string;
  balcon: number;
  elevador: number;
  bodega: number;
  nivelesConstruidos: number;
  estanciaMinima: number;
  disponibilidad: string;
};

// ---------- Users ----------
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("admin").notNull(), // admin|editor|viewer
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------- Properties (igual a tu modelo, en Postgres) ----------
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  direccion: text("direccion").notNull(),
  tipoPropiedad: varchar("tipo_propiedad", { length: 50 }).notNull(),
  tipoOperacion: varchar("tipo_operacion", { length: 50 }).notNull(),
  precio: integer("precio").notNull(),
  habitaciones: integer("habitaciones").notNull(),
  banos: integer("banos").notNull(),
  estacionamientos: integer("estacionamientos").notNull(),
  metros: integer("metros").notNull(),
  antiguedad: integer("antiguedad").notNull(),
  descripcion: text("descripcion").notNull(),
  imagenes: text("imagenes").array().notNull(), // string[]
  fecha: date("fecha", { mode: "string" }).notNull(), // "YYYY-MM-DD"
  ambientes: text("ambientes").array().notNull(),
  servicios: text("servicios").array().notNull(),
  amenidades: text("amenidades").array().notNull(),
  exteriores: text("exteriores").array().notNull(),
  extras: text("extras").array().notNull(),
  detalles: jsonb("detalles").$type<Detalles>().notNull(),
  createdBy: uuid("created_by").references(() => users.id), // opcional
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------- Property Images ----------
export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id, { onDelete: "cascade" }).notNull(),
  key: varchar("key", { length: 512 }).notNull(), // clave R2/S3
  url: text("url").notNull(),
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------- Contacts / Leads ----------
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  propertyId: integer("property_id").references(() => properties.id, { onDelete: "set null" }),
  status: varchar("status", { length: 50 }).default("new").notNull(), // new|contacted|closed
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------- Relations (tipado útil) ----------
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ many }) => ({
  images: many(propertyImages),
}));

// ---------- Inferred Types ----------
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;

export type PropertyImage = typeof propertyImages.$inferSelect;
export type NewPropertyImage = typeof propertyImages.$inferInsert;

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
