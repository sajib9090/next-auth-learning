import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { name, email, password } = await request.json();

    const cleanedName = name?.trim().toLowerCase();

    if (!cleanedName || !email || !password) {
      return new NextResponse("Please fill all fields", { status: 400 });
    }

    if (cleanedName.length < 3) {
      return new NextResponse("Name must be at least 3 characters long", {
        status: 400,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse("Invalid email format", { status: 400 });
    }

    if (password.length < 6) {
      return new NextResponse("Password must be at least 6 characters long", {
        status: 400,
      });
    }

    const db = await connectDB();

    if (!db) {
      return new NextResponse("Failed to connect to the database", {
        status: 500,
      });
    }

    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return new NextResponse("Email already exists", {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name: cleanedName,
      email,
      password: hashedPassword,
      role: "user",
      provider: "email",
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    if (!result?.insertedId) {
      return new NextResponse("Something went wrong, try again", {
        status: 500,
      });
    }

    // Return success response
    return NextResponse.json({
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
