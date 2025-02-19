import QuoteBuilder from "../components/quote-builder"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Quote Builder</h1>
      <QuoteBuilder />
    </div>
  )
}

