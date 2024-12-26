import Card from "./Card";

export default async function CardContainer({params}) {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card params={ params } />
    </div>
  )
}
