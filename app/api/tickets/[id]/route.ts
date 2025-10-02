import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params

    // Mock updating ticket
    const updatedTicket = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ ticket: updatedTicket })
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock deleting ticket
    return NextResponse.json({ message: "Ticket deleted successfully", id })
  } catch (error) {
    console.error("Error deleting ticket:", error)
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 })
  }
}
