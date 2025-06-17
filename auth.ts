import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"; 
import { SignInSchema } from "./lib/validation";
import { ActionResponse } from "./types/global";
import { Account, User } from "@prisma/client";
import { api } from "./lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedFields = SignInSchema.safeParse(credentials);

        if(validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { data: existingAccount } = (await api.accounts.getByProvider(email)) as ActionResponse<Account>;

          if(!existingAccount) return null;

          const { data: existingUser } = (await api.users.getById(existingAccount.userId)) as ActionResponse<User>;

          if(!existingUser) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );

          if(isValidPassword) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
            }
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if(account) {
        const { data: existingAccount, success } = (await api.accounts.getByProvider(
          account.type === "credentials"
            ? token.email!
            : account.providerAccountId
        )) as ActionResponse<Account>;

        if(!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if(userId)
          token.userId = userId.toString();

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if(user?.role)
          token.role = user.role as string;
        
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;

      return session;
    },
    async signIn({ user, account }) {
      if(account?.type === "credentials") return true;
      if(!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username: user.name?.toLowerCase() as string,
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "google",
        providerAccountId: account?.providerAccountId,
      })) as ActionResponse;

      if(!success)  return false;

      return true;
    }
  },
});
