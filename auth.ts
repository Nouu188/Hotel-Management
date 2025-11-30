import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; 
import { SignInSchema } from '@/lib/validation';

function cleanUser(user: any) {
  return {
    ...user,
    phoneNumber: user.phoneNumber ?? undefined,
  };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
            email: { label: 'Email', type: 'text' },
            password: { label: 'Password', type: 'password' },
        },
        authorize: async (credentials) => {
            const validatedFields = SignInSchema.safeParse(credentials);
            if (!validatedFields.success) {
                return null;
            }

            const { email, password } = validatedFields.data;
            
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user || !user.password) {
                return null;
            }
            
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) {
                return cleanUser(user);
            }

            return null;
        }
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.email = user.email;
        token.phoneNumber = user.phoneNumber;
        token.picture = user.image;
      }

      if(trigger === "update" && session.user) {
        console.log("JWT callback triggered with UPDATE", session);

        if (session.image) {
          token.picture = session.image;
        }
        if (session.name) {
          token.name = session.name;
        }
        if (session.email) {
          token.email = session.email;
        }
      }

      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
          });
          if (dbUser) {
            // Ghi đè thông tin trong token bằng dữ liệu mới nhất từ DB
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.image ?? undefined;
            token.role = dbUser.role;
            
          }
        } catch (error) {
          console.error("Error fetching user data in JWT callback:", error);
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.image = token.picture;
        session.user.email = token.email as string;
        session.user.phoneNumber = token.phoneNumber;
      }
      
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};
