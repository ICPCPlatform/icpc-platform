import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Users } from '@/lib/db/schema/Users';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password, firstName, lastName, action } = await request.json();
        console.log(`🔑 Auth attempt: ${action} for ${email}`);

        if (action === 'signup') {
            // Check if user exists
            const existingUser = await db.query.Users.findFirst({
                where: eq(Users.email, email),
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: 'User already exists' },
                    { status: 400 }
                );
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user with all required fields
            const newUser = await db.insert(Users).values({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: 'user',
            }).returning();

            console.log(`✨ New user created: ${email}`);
            return NextResponse.json({ user: newUser[0] });

        } else if (action === 'login') {
            // Find user
            const user = await db.query.Users.findFirst({
                where: eq(Users.email, email),
            });

            if (!user || !user.password) {
                return NextResponse.json(
                    { error: 'Invalid credentials' },
                    { status: 401 }
                );
            }

            // Check password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return NextResponse.json(
                    { error: 'Invalid credentials' },
                    { status: 401 }
                );
            }

            console.log(`✅ User logged in: ${email}`);
            return NextResponse.json({ user: { ...user, password: undefined } });
        }

    } catch (error) {
        console.error('❌ Auth error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 
