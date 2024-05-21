import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle GET requests to retrieve the visit count
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const visit = await prisma.visit.findUnique({
    where: { slug },
  });

  if (!visit) {
    return NextResponse.json({ count: 0 });
  }

  return NextResponse.json({ count: visit.count });
}

// Handle POST requests to increment the visit count
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  let visit = await prisma.visit.findUnique({
    where: { slug },
  });

  if (!visit) {
    visit = await prisma.visit.create({
      data: { slug, count: 1 },
    });
  } else {
    visit = await prisma.visit.update({
      where: { slug },
      data: { count: visit.count + 1 },
    });
  }

  return NextResponse.json({ count: visit.count });
}
