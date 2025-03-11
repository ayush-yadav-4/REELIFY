import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
   providers: [
    CredentialsProvider({
    name:"Credentails",
    credentials:{
      email:{label:"Email",type:"text"},
      password:{label:"Password",type:"password"}
    },
    async authorize(credentials){
       if(!credentials?.password || !credentials?.email){
        throw new Error("Missing email or password");
       }

       try {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email }); 

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare( 
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email
        };
      } catch (error) {
        console.error("Auth error:", error);
        throw error;
      }
      
    }
    })
   ],

   callbacks:{

    async jwt({token,user}){
        if(user){
            token.id = user.id
        }
        return token
    },

    async session({session,token}){
            if(session.user){
                session.user.id = token.id as string // with this usre id will be accesible everywhere
            }
        return session
     }
   },
   pages:{
    signIn:"/login",
    error:"/login"
   },

   session:{
    strategy:"jwt", // means well work with jwt  , tokens will be stored in cookies , with session it will be stored in db 
    maxAge: 30 * 24* 60 *60
},
secret: process.env.NEXTAUTH_SECRET
}
