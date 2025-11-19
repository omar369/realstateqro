import { pgTable, foreignKey, serial, varchar, text, integer, date, jsonb, uuid, timestamp, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const properties = pgTable("properties", {
	id: serial().primaryKey().notNull(),
	titulo: varchar({ length: 255 }).notNull(),
	direccion: text().notNull(),
	tipoPropiedad: varchar("tipo_propiedad", { length: 50 }).notNull(),
	tipoOperacion: varchar("tipo_operacion", { length: 50 }).notNull(),
	precio: integer().notNull(),
	habitaciones: integer().notNull(),
	banos: integer().notNull(),
	medioBano: integer().notNull(),
	estacionamientos: integer().notNull(),
	metros: integer().notNull(),
	antiguedad: integer().notNull(),
	descripcion: text().notNull(),
	fecha: date().notNull(),
	ambientes: text().array().notNull(),
	servicios: text().array().notNull(),
	amenidades: text().array().notNull(),
	exteriores: text().array().notNull(),
	extras: text().array().notNull(),
	// Detalles del inmueble (text inputs)
	estadoConservacion: varchar("estado_conservacion", { length: 255 }).notNull(),
	balcon: varchar("balcon", { length: 255 }).notNull(),
	elevador: varchar("elevador", { length: 255 }).notNull(),
	bodega: varchar("bodega", { length: 255 }).notNull(),
	nivelesConstruidos: varchar("niveles_construidos", { length: 255 }).notNull(),
	estanciaMinimaDias: varchar("estancia_minima_dias", { length: 255 }).notNull(),
	disponibilidad: varchar("disponibilidad", { length: 255 }).notNull(),
	detalles: jsonb().notNull(),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "properties_created_by_users_id_fk"
		}),
]);

export const contacts = pgTable("contacts", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 50 }),
	message: text().notNull(),
	propertyId: integer("property_id"),
	status: varchar({ length: 50 }).default('new').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "contacts_property_id_properties_id_fk"
		}).onDelete("set null"),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }),
	role: varchar({ length: 50 }).default('admin').notNull(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const propertyImages = pgTable("property_images", {
	id: serial().primaryKey().notNull(),
	propertyId: integer("property_id").notNull(),
	key: varchar({ length: 512 }).notNull(),
	url: text().notNull(),
	position: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_images_property_id_properties_id_fk"
		}).onDelete("cascade"),
]);
