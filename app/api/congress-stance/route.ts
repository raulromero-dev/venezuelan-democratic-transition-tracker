import { NextResponse } from "next/server"
import {
  getAllCongressionalStances,
  getLastStanceRefresh,
  getStanceCounts,
  deleteAllCongressionalStances,
} from "@/lib/db/congressional-stances"

export async function GET() {
  try {
    const [stances, lastRefresh, counts] = await Promise.all([
      getAllCongressionalStances(),
      getLastStanceRefresh(),
      getStanceCounts(),
    ])

    return NextResponse.json({
      stances,
      lastRefresh,
      counts,
      totalMembers: stances.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching congressional stances:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch stances" },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  try {
    await deleteAllCongressionalStances()

    return NextResponse.json({
      success: true,
      message: "All congressional stances deleted",
    })
  } catch (error) {
    console.error("[v0] Error deleting congressional stances:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete stances" },
      { status: 500 },
    )
  }
}
