import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, username, email, password, image } = body;

    // Validate required fields
    if (!name && !username && !email && !password && !image) {
      return NextResponse.json(
        { error: "At least one field is required for update" },
        { status: 400 }
      );
    }

    // Check if user exists and is not banned
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        banned: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existingUser.banned) {
      return NextResponse.json(
        { error: "Account is banned and cannot be updated" },
        { status: 403 }
      );
    }

    // Check for duplicate email or username (excluding current user)
    if (email || username) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: session.user.id } },
            {
              OR: [
                ...(email ? [{ email: email.toLowerCase() }] : []),
                ...(username ? [{ username: username }] : []),
              ],
            },
          ],
        },
      });

      if (duplicateUser) {
        const field =
          duplicateUser.email === email?.toLowerCase() ? "Email" : "Username";
        return NextResponse.json(
          { error: `${field} already exists` },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: {
      name?: string;
      username?: string;
      email?: string;
      image?: string;
      passwordHash?: string;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email.toLowerCase();
    if (image !== undefined) updateData.image = image;

    // Hash new password if provided
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }
      updateData.passwordHash = await bcrypt.hash(password, 12);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        isAnonymous: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
