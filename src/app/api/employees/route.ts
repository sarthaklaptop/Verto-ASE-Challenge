import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().describe("Invalid email"),
  position: z.string().min(1, "Position is required"),
});

// GET /api/employees → list all employees
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// POST /api/employees → create new employee
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = employeeSchema.safeParse(body);

    if (!parsed.success) {
      const errors = z.treeifyError(parsed.error);
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const employee = await prisma.employee.create({
      data: parsed.data,
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
