import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import prisma from "../config/prisma.js";

const PUBLIC_ROLES = ["organizer", "user"] ;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: ["http://localhost:5000"],

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
      signupRole: {
        type: "string",
        required: false,
        input: true, // Accepts the user's choice during sign-up
      },
    },
  },

  plugins: [
    admin({
      defaultRole: "user",
    }),
  ],

    databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requestedRole = user.signupRole;
          const assignedRole = PUBLIC_ROLES.includes(requestedRole)
            ? requestedRole
            : "user"; 

          return {
            data: {
              ...user,
              role: assignedRole,
            },
          };
        },
      },
    },
  },
});
