'use server'
import { prisma } from '@/app/lib/prisma'
export async function subscribe(formData){
    
    console.log("Server action triggered");
   
    const rawEmail = formData.get('email')
    const email = rawEmail?.toString().trim()

    if (! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    {
        throw new Error("Enter a valid email address");
    }

    try {
        await prisma.subscribe.create({
          data: { email },
        })
      } catch (err) {
        console.error("Prisma error:", err);
        if (err.code === 'P2002') {
          throw new Error("This email is already subscribed.")
        }
        throw new Error("Something went wrong.")
        
    }
}