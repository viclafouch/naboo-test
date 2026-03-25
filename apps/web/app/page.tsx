import { Button } from '@naboo/design-system'

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-bold">Naboo Places</h1>
        <p className="text-lg text-muted-foreground">
          Discover unique places to stay
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button>Get started</Button>
        <Button variant="outline">Browse places</Button>
        <Button variant="secondary">Explore</Button>
        <Button variant="ghost">Learn more</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="link">Terms</Button>
      </div>
    </main>
  )
}

export default Home
