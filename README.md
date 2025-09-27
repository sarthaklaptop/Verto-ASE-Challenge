# Employee Directory Management

**Live Demo:** [https://your-live-project-link.com](https://your-live-project-link.com)

A simple web application to manage employee data. Users can **view, add, edit, delete, and search employees** efficiently. Built with **Next.js, TypeScript, ShadCN UI components, and React Hot Toast** for notifications.

---

## Features

- View a table of employees with name, email, position, and join date.  
- Add a new employee using a modal dialog form.  
- Edit employee details inline via modal dialogs.  
- Delete employees with confirmation dialogs.  
- Search/filter employees by name.  
- Toast notifications for all CRUD actions.  

---

## Tech Stack

- **Frontend:** Next.js 13, TypeScript, ShadCN UI components  
- **Backend:** Next.js API routes, Prisma (with SQLite/PostgreSQL)  
- **Notifications:** react-hot-toast  
- **Form Validation (optional):** Zod  

---

## Setup & Running Locally

1. **Clone the repository**
```bash
git clone https://github.com/your-username/employee-directory.git
cd employee-directory
```

2. **Install dependencies**
```bash 
npm install
```
3. **Set up the database**
```bash 
npx prisma migrate dev
```
- Configure your .env file with your database URL.

4. **Run the development server**
```bash 
npm run dev
```
- Open http://localhost:3000
 to view the app.

## Assumptions & Design Choices
- Employee records have name, email, position, and createdAt.

- All CRUD operations are handled via Next.js API routes.

- Used ShadCN UI components for clean and consistent UI.

- Toast notifications provide feedback on all actions.

- Dialog modals are used for adding, editing, and deleting employees.

- Search/filter implemented on the frontend for quick lookups.

## Video Walkthrough (Bonus)

- ### [Watch the video explanation](https://www.loom.com/share/your-video-link)

- Demonstrates the project flow, design decisions, and implementation.

