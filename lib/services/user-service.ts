import type { User } from "@prisma/client"
import { prisma } from "../db/prisma"
import * as bcrypt from "bcryptjs"

export async function createUser(data: {
  name: string
  email: string
  password: string
}): Promise<User> {
  // 哈希密码
  const hashedPassword = await bcrypt.hash(data.password, 10)

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  })
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  })
}

export async function validateUserCredentials(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email)

  if (!user) {
    return null
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return null
  }

  return user
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string
    email?: string
  },
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data,
  })
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> {
  const user = await getUserById(userId)

  if (!user) {
    return false
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

  if (!isPasswordValid) {
    return false
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  })

  return true
}

