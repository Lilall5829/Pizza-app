# Food Ordering Web Application

A modern food ordering web application built with Next.js, TypeScript, Tailwind CSS, Supabase, and Stripe.

## 🚀 Features

- **Modern Web Interface**: Built with Next.js 14 and App Router
- **Responsive Design**: Tailwind CSS for beautiful, mobile-friendly UI
- **Real-time Database**: Supabase for data management and authentication
- **Payment Processing**: Stripe integration for secure payments
- **Type Safety**: Full TypeScript support
- **Image Management**: Optimized image handling with Next.js Image component

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Payments**: Stripe
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd FoodOrdering
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Database Setup**

   - Create a new Supabase project
   - Run the SQL script from `supabase-setup-fixed.sql` in your Supabase SQL editor
   - Update your `.env.local` file with the actual URLs and keys

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄 Database Schema

The application uses the following main tables:

- `profiles` - User profiles and authentication
- `products` - Food items with name, price, and images
- `orders` - Customer orders with status tracking
- `order_items` - Individual items within orders

## 🎨 Key Components

- **Header**: Navigation with logo and menu links
- **ProductCard**: Interactive product display with add to cart
- **CartListItem**: Shopping cart item management
- **OrderListItem**: Order history display
- **RemoteImage**: Optimized image loading from Supabase storage

## 📱 Pages

- `/` - Homepage with featured products
- `/menu` - Full product catalog
- `/cart` - Shopping cart management
- `/orders` - Order history (coming soon)
- `/admin` - Admin dashboard (coming soon)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   ├── menu/           # Menu pages
│   └── cart/           # Cart pages
├── components/          # Reusable components
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
└── constants/          # Application constants
```

## 🔐 Environment Variables

Required environment variables:

| Variable                             | Description            | Example                   |
| ------------------------------------ | ---------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase project URL   | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase anonymous key | `eyJhbGciOi...`           |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...`             |
| `STRIPE_SECRET_KEY`                  | Stripe secret key      | `sk_test_...`             |

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- Heroku
- AWS Amplify

## 🛡 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS) policies
- Stripe webhook signature verification
- Input validation and sanitization

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@yourcompany.com or create an issue in the repository.

---

**Note**: This project was converted from a React Native Expo application to a Next.js web application. All mobile-specific code has been removed and replaced with web-optimized components.
