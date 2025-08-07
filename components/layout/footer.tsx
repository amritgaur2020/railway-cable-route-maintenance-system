export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-col lg:flex-row justify-between items-center text-sm text-gray-600">
          <div className="mb-2 lg:mb-0">
            <p>© 2024 Indian Railways - Signal & Telecommunication Department</p>
          </div>
          <div className="flex items-center space-x-4">
            <span>System Version: 2.1.4</span>
            <span>Last Updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
