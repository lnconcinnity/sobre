'use server';
import { headers } from 'next/headers';

export async function getUserCity() {
    const headerList = await headers();
    const city = headerList.get('x-vercel-ip-city') || 'Manila'; 
    return city;
}