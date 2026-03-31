import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const postId = params.id

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id!,
        postId
      }
    }
  })

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id }
    })
    return NextResponse.json({ liked: false })
  }

  await prisma.like.create({
    data: {
      userId: session.user.id!,
      postId
    }
  })

  return NextResponse.json({ liked: true })
}
