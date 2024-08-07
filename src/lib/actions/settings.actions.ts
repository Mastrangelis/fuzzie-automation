"use server";

// export const async getUserByClerkId = async (clerkId: string) => {
//     try {
//         const user = await db.user.findUnique({ where: { clerkId: authUser.id } });

//     } catch {

//     }
// }

//  const removeProfileImage = async () => {
//    "use server";
//    const response = await db.user.update({
//      where: {
//        clerkId: authUser.id,
//      },
//      data: {
//        profileImage: "",
//      },
//    });
//    return response;
//  };

//  const uploadProfileImage = async (image: string) => {
//    "use server";
//    const id = authUser.id;
//    const response = await db.user.update({
//      where: {
//        clerkId: id,
//      },
//      data: {
//        profileImage: image,
//      },
//    });

//    return response;
//  };

//  const updateUserInfo = async (name: string) => {
//    "use server";

//    const updateUser = await db.user.update({
//      where: {
//        clerkId: authUser.id,
//      },
//      data: {
//        name,
//      },
//    });
//    return updateUser;
//  };
