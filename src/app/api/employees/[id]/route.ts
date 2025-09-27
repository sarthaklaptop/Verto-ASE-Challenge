import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().describe("Invalid email"),
  position: z.string().min(1, "Position is required"),
});

// GET /api/employees/:id → fetch one
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
): Promise<NextResponse<Employee | { error: string }>> {
  try {
    const { id } = await params; // Await the params Promise
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

// PUT /api/employees/:id → update employee
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    const { id } = await params; // Await the params Promise
    const body = await req.json();
    const parsed = employeeSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten(); // Fixed from treeifyError
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/:id → delete employee
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    const { id } = await params; // Await the params Promise
    await prisma.employee.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}