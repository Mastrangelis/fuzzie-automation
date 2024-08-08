"use server";

import { db } from "../db";

export const getUserByClerkId = async (clerkId: string) => {
  try {
    const user = await db.user.findUnique({
      where: { clerkId },
      include: {
        connections: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (e) {
    throw e;
  }
};

export const removeProfileImage = async (clerkId: string) => {
  try {
    const updatedUser = await db.user.update({
      where: {
        clerkId,
      },
      data: {
        profileImage: "",
      },
    });

    return updatedUser;
  } catch (e) {
    throw e;
  }
};

export const uploadProfileImage = async (clerkId: string, image: string) => {
  try {
    const updatedUser = await db.user.update({
      where: {
        clerkId,
      },
      data: {
        profileImage: image,
      },
    });

    return updatedUser;
  } catch (e) {
    throw e;
  }
};

export const updateUserInfo = async (clerkId: string, name: string) => {
  try {
    const updatedUser = await db.user.update({
      where: {
        clerkId,
      },
      data: {
        name,
      },
    });

    return updatedUser;
  } catch (e) {
    throw e;
  }
};
