### 📌 **Project Overview**

- **Introduction**

Pizzilla is a full-featured online pizza ordering platform designed for seamless customer experience and efficient restaurant management. The system supports user registration (including Google OAuth2), real-time menu browsing, online ordering, secure online payment, order tracking, and admin management—all presented with a clean and modern UI built on Next.js.

- **Project Motivation**

This project was initially created as a practice exercise for mobile application development using React Native. As my skills and interests evolved, I decided to refactor the original codebase and transform it into a modern web application, leveraging updated technologies such as Next.js and related tools. This allowed me to further enhance the user experience, scalability, and maintainability of the project while exploring the latest trends in full-stack development.

---

### 🌟 **Key Features**

- **User Authentication & Profile**
    - Register, sign in with email or Google account (OAuth2).
    - Manage personal account information and delivery address.
- **Menu & Ordering**
    - Browse featured pizzas and sides with images, descriptions, and prices.
    - Add items to the cart, adjust quantities, and view order summary in real-time.
- **Shopping Cart, Checkout & Payment**
    - Review selected items, modify quantities, and proceed to checkout.
    - Secure online payment powered by Stripe (credit/debit cards).
    - View detailed pricing breakdown (subtotal, delivery, total).
- **Order Management & Tracking**
    - Track order status in real time (New, Cooking, Delivering, Delivered).
    - View order history and delivery information.
- **Admin Dashboard**
    - Manage menu items, users, and orders with dedicated admin tools.
    - Update product images, prices, and stock status.
    - View analytics: total products, orders, customers.
- **User Management**
    - Admins can manage user roles, edit or delete user accounts.
    - View key stats such as user count and order volume.
- **Responsive UI**
    - Consistent, mobile-friendly design for both user and admin views.

---

### 🛠️ **Tech Stack**

- **Frontend:** **Next.js** (React framework) + TypeScript
- **UI Framework:** Tailwind CSS, Shadcn/ui, custom component library
- **State Management:** Redux Toolkit / Context API
- **Backend:** **Supabase** (PostgreSQL database, Edge Functions, Auth, Realtime, Storage)
- **Authentication:** Supabase Auth, **Google OAuth2** integration
- **Payment:** **Stripe API** integration for secure online payments
- **Deployment:** **Vercel** (Continuous Deployment from GitHub)
- **Other:** RESTful API, Form validation, Responsive layout

> Technical Highlights:
> 
> - **Automated Deployment:** Integrated with GitHub for CI/CD. Code is automatically built and deployed to Vercel on every push to the main branch, enabling fast, reliable releases.
> - **Stripe Payments:** Seamlessly integrated Stripe for secure, PCI-compliant credit card processing.
> - Used Supabase for backend-as-a-service, Next.js for SSR and fast performance, and Google OAuth2 for frictionless social login.

---

### 💡 **Highlights & My Contribution**

- Designed and implemented a modern, user-friendly UI with Next.js and Tailwind CSS.
- Integrated **Stripe** payment gateway for secure online payments.
- Integrated **Google OAuth2** with Supabase Auth for smooth social login.
- Built a real-time, responsive shopping cart and checkout flow.
- Developed complete order workflow: from menu selection to order tracking.
- Created powerful admin tools for product, order, and user management.
- Established a **CI/CD workflow with GitHub and Vercel** for automated deployments.
- Focused on accessibility, scalability, security（PCI-compliance），and best practices in both frontend and backend.

---

### 🚀 **Live Demo & Source Code**

- **Live Demo:** [pizzilla-app.vercel.app](http://pizza-app-git-main-lilall5829-gmailcoms-projects.vercel.app)
- **Source Code:** [GitHub Repository](https://github.com/Lilall5829/Pizza-app)

---

### 📝 **Project Reflection**

By building Pizzilla with Next.js and Supabase, and automating deployment with GitHub and Vercel, I gained hands-on experience with modern full-stack development and cloud-native deployment pipelines. This project showcases my ability to build, iterate, and ship robust production-ready applications with a seamless developer experience.
