"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Employee = {
  id: string;
  name: string;
  email: string;
  position: string;
  createdAt: string;
};

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchEmployees() {
      const toastId = toast.loading("Loading employees...");

      try {
        const res = await fetch("/api/employees");
        if (!res.ok) throw new Error("Failed to fetch");
        type EmployeeResponse = Employee[];
        const data: EmployeeResponse = await res.json();
        setEmployees(data);
        toast.success("Employees loaded successfully!", { id: toastId });
      } catch (err) {
        console.error("Failed to fetch employees", err);
        toast.error("Failed to load employees", { id: toastId });
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  async function handleUpdateEmployee(
    e: React.FormEvent<HTMLFormElement>,
    empId: string
  ) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      position: formData.get("position") as string,
    };

    const toastId = toast.loading("Updating employee...");

    try {
      const res = await fetch(`/api/employees/${empId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      toast.success("Employee updated!", { id: toastId });

      setEmployees((prev) => prev.map((e) => (e.id === empId ? updated : e)));

      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update employee", { id: toastId });
    }
  }

  async function handleDeleteEmployee(empId: string) {
    const toastId = toast.loading("Deleting employee...");

    try {
      const res = await fetch(`/api/employees/${empId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Employee deleted!", { id: toastId });

      setEmployees((prev) => prev.filter((e) => e.id !== empId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete employee", { id: toastId });
    }
  }

  async function handleAddEmployee(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      position: formData.get("position") as string,
    };

    const toastId = toast.loading("Adding employee...");

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to add employee");
      }

      const newEmployee = await res.json();
      toast.success("Employee added!", { id: toastId });

      // Update local state
      setEmployees((prev) => [...prev, newEmployee]);
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add employee", { id: toastId });
    }
  }

  const filteredEmployees: Employee[] = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!loading && searchQuery && filteredEmployees.length === 0) {
      const timeout = setTimeout(() => {
        if (filteredEmployees.length === 0) {
          toast("No employees found with this name.", { icon: "🔍" });
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [searchQuery, filteredEmployees, loading]);

  return (
    <div className="font-sans min-h-screen p-8 sm:p-20 flex flex-col gap-8 w-full">
      <h1 className="text-3xl font-bold">Employee Directory</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Employee</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Enter name, email, and position for the new employee.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleAddEmployee}
            className="flex flex-col gap-4 mt-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="text"
              name="position"
              placeholder="Position"
              className="border rounded px-3 py-2 w-full"
              required
            />
            <Button type="submit" className="mt-2">
              Add
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Input
        type="text"
        placeholder="Search employees by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full max-w-md"
      />

      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="rounded-md border w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>
                    {new Date(emp.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Employee Details</DialogTitle>
                          <DialogDescription>
                            Update the employees name, email, or position.
                          </DialogDescription>
                          <form
                            onSubmit={(e) => handleUpdateEmployee(e, emp.id)}
                            className="flex flex-col gap-4 mt-4"
                          >
                            <input
                              type="text"
                              name="name"
                              defaultValue={emp.name}
                              placeholder="Name"
                              className="border rounded px-3 py-2 w-full"
                              required
                            />
                            <input
                              type="email"
                              name="email"
                              defaultValue={emp.email}
                              placeholder="Email"
                              className="border rounded px-3 py-2 w-full"
                              required
                            />
                            <input
                              type="text"
                              name="position"
                              defaultValue={emp.position}
                              placeholder="Position"
                              className="border rounded px-3 py-2 w-full"
                              required
                            />
                            <Button type="submit" className="mt-2">
                              Update
                            </Button>
                          </form>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="hover:bg-red-600"
                        >
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xs">
                        <DialogHeader>
                          <DialogTitle>Confirm Delete</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this employee? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="hover:bg-red-600"
                          >
                            Confirm
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
