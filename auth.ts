import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; 
import { SignInSchema } from '@/lib/validation';

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
                return user;
            }

            return null;
        }
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.role = user.role;
        token.email = user.email;
        token.picture = user.image;
      }

      if(trigger === "update" && session.user) {
        token.name = session.user.name;
        token.picture = session.user.image;
        token.email = session.user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.email = token.email
      }
      
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };