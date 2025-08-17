import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Pour l'exemple, nous utilisons un utilisateur en dur
// Dans une application réelle, vous devriez vérifier les identifiants dans votre base de données
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123', // À remplacer par un mot de passe haché en production
    name: 'Administrateur',
    role: 'admin',
  },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        // Vérification des identifiants
        const user = users.find(
          (user) =>
            user.email === credentials.email &&
            user.password === credentials.password
        );

        if (user) {
          // Retourne l'utilisateur s'il est trouvé
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
        // Retourne null si l'utilisateur n'est pas trouvé
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Ajoute les informations de l'utilisateur au token
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Ajoute les informations du token à la session
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'votre-secret-tres-securise',
};

export default NextAuth(authOptions);
