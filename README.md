# InvoiceFlow

InvoiceFlow is a full-stack web application designed for small businesses to manage invoices, track payments, and send automated email reminders. 

This project was developed as a submission for the Binary Automates Software Engineering Internship take-home assignment.

## Features

- **Invoice Management:** Create, store, and view detailed invoices. Supports multiple templates and tracks line items, taxes, and discounts.
- **Payment Reminders:** Send payment reminders via email with attached PDF versions of the invoice.
- **Status Tracking:** Update invoice statuses (e.g., Draft, Sent, Paid, Overdue) with state transition logic and audit logging.
- **Search & Filtering:** Client-side text search and status filtering for quick record retrieval.
- **Financial Dashboard:** High-level overview featuring total invoices, paid vs. unpaid metrics, recent sales, and revenue charts.
- **AI Analytics:** Integrated assistant to analyze sales data and provide business insights.
- **Responsive UI:** Interface optimized for desktop, tablet, and mobile devices.

## Tech Stack

- **Framework:** Next.js 15+ (App Router, Server Actions)
- **Frontend:** React 19, Tailwind CSS v4, shadcn/ui
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **Authentication:** Custom JWT session management using `jose` and `bcryptjs`
- **Emails:** Resend & React Email
- **Document Generation:** `jspdf` and `html-to-image`
- **AI Integration:** Google GenAI SDK

## Assignment Requirements Fulfillment

| Requirement | Implementation Details |
| :--- | :--- |
| **1. Invoices** | Implemented CRUD operations via database-backed Next.js Server Actions. Includes fields for invoice number, amounts, due dates, and customer details. |
| **2. Reminders** | Implemented UI to send reminders, update statuses manually, and track all actions in an `invoice_activities` audit log table. |
| **3. Real Email** | Integrated Resend API to send HTML emails to customers with PDF attachments. |
| **4. Search / Filtering** | Implemented client-side filtering by customer name, description, and invoice status. |
| **5. Summary / Dashboard**| Created a `/dashboard` route tracking total invoices, unpaid, overdue, and paid amounts with data visualization. |
| **6. Responsive UI** | Built with Tailwind CSS to ensure responsiveness across various screen sizes. |
| **Additional Features** | Added PDF Generation, AI Sales Analytics, and stateless edge-ready authentication. |

## Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL database URL
- Resend API Key (for emails)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd invoiceflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory based on the `.env.example`:
   ```env
   DATABASE_URL="postgresql://user:password@host/dbname"
   JWT_SECRET="your-super-secret-jwt-key"
   RESEND_API_KEY="re_your_resend_api_key"
   EMAIL_FROM="InvoiceFlow <noreply@yourdomain.com>"
   GEMINI_API_KEY="your_google_genai_key" # Optional for AI features
   ```

4. **Initialize the database:**
   Push the schema to your database using Drizzle:
   ```bash
   npm run db:push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Next.js App Router pages.
- `src/server/actions`: Server Actions for data mutations.
- `src/server/queries`: Secure data fetching logic.
- `src/db/schema`: Drizzle ORM database schemas.
- `src/components`: Reusable UI components, email templates, and charts.

## Architecture & Engineering Decisions

- **Server Actions over API Routes:** Utilized Next.js Server Actions for client-to-server RPC communication, reducing boilerplate and improving type safety.
- **Stateless Authentication:** Implemented custom JWT session management using `jose` for secure, fast authentication at the edge without the overhead of external auth providers or heavy session databases.
- **Database Choice:** Chose PostgreSQL via Neon Serverless and Drizzle ORM for strong relational data integrity, ease of schema management, and fast querying.