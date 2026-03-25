import Link from 'next/link'
import { Button } from '@naboo/design-system'

const Home = () => {
  return (
    <main
      id="main-content"
      className="flex flex-1 flex-col items-center justify-center px-6"
    >
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Discover the world
          </p>
          <h1 className="text-center text-6xl font-bold tracking-tight sm:text-8xl">
            Naboo Places
          </h1>
          <div className="mt-2 h-px w-16 bg-primary/40" />
          <p className="max-w-md text-center text-lg leading-relaxed text-muted-foreground">
            Handpicked apartments, houses, and villas in the most beautiful
            destinations across the globe.
          </p>
        </div>
        <Button size="lg" nativeButton={false} render={<Link href="/search" />}>
          Browse places
        </Button>
      </div>
    </main>
  )
}

export default Home
