import { z } from "zod";

const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const AddressSchema = z.object({
  address: z.string(),
  city: z.string(),
  coordinates: CoordinatesSchema,
  country: z.string(),
  postalCode: z.string(),
  state: z.string(),
  stateCode: z.string(),
});

const BankSchema = z.object({
  cardExpire: z.string(),
  cardNumber: z.string(),
  cardType: z.string(),
  currency: z.string(),
  iban: z.string(),
});

const CompanySchema = z.object({
  address: AddressSchema,
  department: z.string(),
  name: z.string(),
  title: z.string(),
});

const CryptoSchema = z.object({
  coin: z.string(),
  network: z.string(),
  wallet: z.string(),
});

const HairSchema = z.object({
  color: z.string(),
  type: z.string(),
});

export const UserSchema = z.object({
  address: AddressSchema,
  age: z.number(),
  bank: BankSchema,
  birthDate: z.string(),
  bloodGroup: z.string(),
  company: CompanySchema,
  crypto: CryptoSchema,
  ein: z.string(),
  email: z.email(),
  eyeColor: z.string(),
  firstName: z.string(),
  gender: z.string(),
  hair: HairSchema,
  height: z.number(),
  id: z.number(),
  image: z.url(),
  ip: z.string(),
  lastName: z.string(),
  macAddress: z.string(),
  maidenName: z.string(),
  password: z.string(),
  phone: z.string(),
  role: z.string(),
  ssn: z.string(),
  university: z.string(),
  userAgent: z.string(),
  username: z.string(),
  weight: z.number(),
});

export const UserListResponseSchema = z.object({
  limit: z.number(),
  skip: z.number(),
  total: z.number(),
  users: z.array(UserSchema),
});

export const CreateUserSchema = z.object({
  age: z.number(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
});

export const UpdateUserSchema = z.object({
  age: z.number().optional(),
  email: z.email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
});

export const DeleteUserResponseSchema = UserSchema.extend({
  deletedOn: z.string(),
  isDeleted: z.boolean(),
});
