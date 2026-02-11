import * as v from "valibot";

const CoordinatesSchema = v.object({
  lat: v.number(),
  lng: v.number(),
});

const AddressSchema = v.object({
  address: v.string(),
  city: v.string(),
  coordinates: CoordinatesSchema,
  country: v.string(),
  postalCode: v.string(),
  state: v.string(),
  stateCode: v.string(),
});

const BankSchema = v.object({
  cardExpire: v.string(),
  cardNumber: v.string(),
  cardType: v.string(),
  currency: v.string(),
  iban: v.string(),
});

const CompanySchema = v.object({
  address: AddressSchema,
  department: v.string(),
  name: v.string(),
  title: v.string(),
});

const CryptoSchema = v.object({
  coin: v.string(),
  network: v.string(),
  wallet: v.string(),
});

const HairSchema = v.object({
  color: v.string(),
  type: v.string(),
});

export const UserSchema = v.object({
  address: AddressSchema,
  age: v.number(),
  bank: BankSchema,
  birthDate: v.string(),
  bloodGroup: v.string(),
  company: CompanySchema,
  crypto: CryptoSchema,
  ein: v.string(),
  email: v.pipe(v.string(), v.email()),
  eyeColor: v.string(),
  firstName: v.string(),
  gender: v.string(),
  hair: HairSchema,
  height: v.number(),
  id: v.number(),
  image: v.pipe(v.string(), v.url()),
  ip: v.string(),
  lastName: v.string(),
  macAddress: v.string(),
  maidenName: v.string(),
  password: v.string(),
  phone: v.string(),
  role: v.string(),
  ssn: v.string(),
  university: v.string(),
  userAgent: v.string(),
  username: v.string(),
  weight: v.number(),
});

export type User = v.InferOutput<typeof UserSchema>;

export const UserListResponseSchema = v.object({
  limit: v.number(),
  skip: v.number(),
  total: v.number(),
  users: v.array(UserSchema),
});

export type UserListResponse = v.InferOutput<typeof UserListResponseSchema>;

export const CreateUserSchema = v.object({
  age: v.number(),
  email: v.pipe(v.string(), v.email()),
  firstName: v.string(),
  lastName: v.string(),
  username: v.string(),
});

export type CreateUserInput = v.InferInput<typeof CreateUserSchema>;

export const UpdateUserSchema = v.object({
  age: v.optional(v.number()),
  email: v.optional(v.pipe(v.string(), v.email())),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  username: v.optional(v.string()),
});

export type UpdateUserInput = v.InferInput<typeof UpdateUserSchema>;

export const SearchUsersParamsSchema = v.object({
  q: v.string(),
});

export type SearchUsersParams = v.InferInput<typeof SearchUsersParamsSchema>;

//? HTTPクエリパラメータ/URLパラメータは文字列として送信されるため、文字列→数値の自動変換をサポート
const CoercedNumber = v.pipe(v.union([v.string(), v.number()]), v.transform(Number));

export const ListUsersParamsSchema = v.object({
  limit: v.optional(CoercedNumber),
  skip: v.optional(CoercedNumber),
});

export type ListUsersParams = v.InferOutput<typeof ListUsersParamsSchema>;

export const IdParamSchema = v.object({
  id: CoercedNumber,
});

export const DeleteUserResponseSchema = v.object({
  ...UserSchema.entries,
  deletedOn: v.string(),
  isDeleted: v.boolean(),
});

export type DeleteUserResponse = v.InferOutput<typeof DeleteUserResponseSchema>;
