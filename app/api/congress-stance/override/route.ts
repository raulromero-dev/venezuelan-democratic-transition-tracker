import { type NextRequest, NextResponse } from "next/server"
import {
  getStanceOverride,
  getAllStanceOverrides,
  upsertStanceOverride,
  deleteStanceOverride,
} from "@/lib/db/congressional-stances"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberName = searchParams.get("memberName")
    const chamber = searchParams.get("chamber")

    // If specific member requested, return that override
    if (memberName && chamber) {
      const override = await getStanceOverride(memberName, chamber)
      return NextResponse.json({ override })
    }

    // Otherwise return all overrides
    const overrides = await getAllStanceOverrides()
    return NextResponse.json({ overrides })
  } catch (error) {
    console.error("[v0] Error fetching stance override:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch override" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memberName, chamber, overrideStance, userNotes } = body

    if (!memberName || !chamber) {
      return NextResponse.json(
        { error: "memberName and chamber are required" },
        { status: 400 }
      )
    }

    await upsertStanceOverride({
      member_name: memberName,
      chamber: chamber,
      override_stance: overrideStance || "",
      user_notes: userNotes || "",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error saving stance override:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save override" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberName = searchParams.get("memberName")
    const chamber = searchParams.get("chamber")

    if (!memberName || !chamber) {
      return NextResponse.json(
        { error: "memberName and chamber are required" },
        { status: 400 }
      )
    }

    await deleteStanceOverride(memberName, chamber)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting stance override:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete override" },
      { status: 500 }
    )
  }
}
