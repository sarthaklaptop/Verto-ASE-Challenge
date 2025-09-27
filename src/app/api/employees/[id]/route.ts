import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().describe("Invalid email"),
  position: z.string().min(1, "Position is required"),
});

// GET /api/employees/:id → fetch one
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

// PUT /api/employees/:id → update employee
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = employeeSchema.safeParse(body);

    if (!parsed.success) {
      const errors = z.treeifyError(parsed.error);
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const updated = await prisma.employee.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/:id → delete employee
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.employee.delete({
      where: { id: params.id },
    });
    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
