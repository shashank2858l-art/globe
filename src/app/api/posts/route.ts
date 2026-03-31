import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const prisma = new PrismaClient()

const postSchema = z.object({
  content: z.string().min(1).max(5000),
  codeSnippet: z.string().optional(),
  tags: z.array(z.string()).max(5),
  isPremium: z.boolean().optional()
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const tag = searchParams.get("tag")

  const where: any = {}
  if (tag) {
    where.tags = { has: tag }
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          isVerified: true,
          isPremium: true
        }
      },
      _count: {
        select: {
          comments: true,
          likes: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit
  })

  const total = await prisma.post.count({ where })

  return NextResponse.json({
    posts,
    total,
    pages: Math.ceil(total / limit)
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = postSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        content: data.content,
        codeSnippet: data.codeSnippet,
        tags: data.tags,
        isPremium: data.isPremium || false,
        authorId: session.user.id!
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            isVerified: true,
            isPremium: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}
