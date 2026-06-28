import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-8">
      <div className="text-center">
        <h1 className="text-6xl font-medium text-gold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Order not found</p>
        <Link href="/orders" className="text-gold hover:underline">
          Back to orders
        </Link>
      </div>
    </div>
  );
}
