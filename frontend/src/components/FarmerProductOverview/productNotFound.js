export default function ProductNotFound() {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! Product not found.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }