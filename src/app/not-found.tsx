import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="border border-gray-200 rounded-xl p-10">
        <h1 className="text-3xl font-bold mb-2">Страница не найдена</h1>
        <p className="text-gray-600 mb-6">К сожалению, запрашиваемая страница не существует.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}


