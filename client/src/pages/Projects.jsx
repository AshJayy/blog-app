import CallToAction from '../components/CallToAction'

export default function Projects() {
  return (
    <div className="min-h-screen flex flex-col p-8 items-center justify-center text-gray-800 dark:text-gray-300">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-3">Projects</h1>
        <p>Build fun and engaging projects while learning HTML, CSS, and JavaScript!</p>
        <CallToAction />
      </div>
    </div>
  )
}
