# Ecommerce Store

## Features
- Modern responsive UI with product listing, details, and cart
- Hamburger menu for category navigation (Men, Women, Kids, Accessories, Electronics)
- User authentication (login/register/profile)
- Order placement with order confirmation notification
- Promo/coupon code support (SAVE10, FREESHIP, HM50)
- Indian address and currency localization (₹, PIN code, Indian states)
- Product images for all items
- Wishlist, order history, and profile management
- Notification system for offers and order updates

## Manual Testing Guide
1. **Start the app:**
   - Run `npm install` then `npm run dev`
   - Open [http://localhost:3000](http://localhost:3000)
2. **Browse Products:**
   - View product images, details, and prices
   - Add items to cart and wishlist
3. **Hamburger Navigation:**
   - Click the hamburger icon beside the SnugBuy logo
   - Select a category to filter products
   - Menu closes on selection or outside click
4. **Cart & Checkout:**
   - Add products to cart, apply promo codes (SAVE10, FREESHIP, HM50)
   - Proceed to checkout, fill Indian address, place order
   - See order confirmation notification
5. **User Account:**
   - Register/login, update profile, view order history
6. **Notifications:**
   - Check for order and promo notifications in the notification center

## Hamburger Navigation Overview
- Located beside the SnugBuy logo in the header
- Click to open a dropdown with product categories
- Categories: Men, Women, Kids, Accessories, Electronics
- Closes on selection or clicking outside
- Works on both desktop and mobile

## Project Structure
```
app/
  components/         # Reusable UI components (Navigation, ProductCard, etc.)
  hooks/              # Custom React hooks (useAuth, useCart, etc.)
  auth/               # Auth pages (login, register)
  profile/            # User profile and order history
  checkout/           # Checkout and order flow
  admin/              # Admin dashboard (mock)
  product/[id]/       # Product details page
  page.tsx            # Home page (product listing)
public/
  ...                 # Static assets
styles/
  globals.css         # Tailwind and global styles
package.json          # Project dependencies
README.md             # Project documentation
```

## Built With
- [Next.js 15](https://nextjs.org/)
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Unsplash](https://unsplash.com/) (for product images)

## Future Scope
- Payment gateway integration (Razorpay, Stripe, etc.)
- Real backend with database (MongoDB, PostgreSQL, etc.)
- Admin product/order management
- Advanced filtering, search, and sorting
- Progressive Web App (PWA) support
- Multi-language and multi-currency support
- More detailed analytics and reporting

## Acknowledgements
- [Next.js](https://nextjs.org/) and [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Unsplash](https://unsplash.com/) for demo product images
- [Lucide Icons](https://lucide.dev/)
- Open source community for inspiration and packages 