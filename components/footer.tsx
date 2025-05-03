import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-6 border-t mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Created by{" "}
          <Link href="https://google.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Mikhail Lazarevich Snake
          </Link>
        </p>
      </div>
    </footer>
  )
}
