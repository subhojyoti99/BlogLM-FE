export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-start px-6 py-2 border-b bg-white shadow-sm">
      {/* Left Logo */}
      <div className="basis-1/3 items-center">
        <img
          src="/src/assets/bloggerlm-logo.png" // replace with your logo file in public/
          alt="Logo"
          className="h-10"
        />
        {/* <span className="text-xl font-bold text-blue-600">AI Blog Generator</span> */}
      </div>

      {/* Center Nav Items */}
      <nav className="flex basis-1/3 items-center justify-center space-x-8 text-gray-700 font-medium">
        <a href="/" className="hover:text-blue-600">
          Home
        </a>
        <a href="/blogs" className="hover:text-blue-600">
          Blogs
        </a>
        <a href="#" className="hover:text-blue-600">
          Features
        </a>
        <a href="#" className="hover:text-blue-600">
          About
        </a>
      </nav>

      {/* Right User Info */}
      <div className="flex basis-1/3 items-center justify-end space-x-3">
        <img
          src="https://i.pravatar.cc/40" // placeholder avatar
          alt="User Avatar"
          className="h-9 w-9 rounded-full border"
        />
        <div className="h-6 w-px bg-gray-300" /> {/* vertical line */}
        <span className="font-medium text-gray-800">Subhojyoti</span>
      </div>
    </header>
  );
}
