import { relations } from "drizzle-orm/relations";
import { users, properties, contacts, propertyImages } from "./schema";

export const propertiesRelations = relations(properties, ({one, many}) => ({
	user: one(users, {
		fields: [properties.createdBy],
		references: [users.id]
	}),
	contacts: many(contacts),
	propertyImages: many(propertyImages),
}));

export const usersRelations = relations(users, ({many}) => ({
	properties: many(properties),
}));

export const contactsRelations = relations(contacts, ({one}) => ({
	property: one(properties, {
		fields: [contacts.propertyId],
		references: [properties.id]
	}),
}));

export const propertyImagesRelations = relations(propertyImages, ({one}) => ({
	property: one(properties, {
		fields: [propertyImages.propertyId],
		references: [properties.id]
	}),
}));