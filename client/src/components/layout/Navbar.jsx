function Navbar() {
  return (
    <nav className="bg-slate-950 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-cyan-400">
          EchoSoul
        </h1>

        <ul className="flex gap-8">
          <li>Home</li>
          <li>Features</li>
          <li>About</li>
          <li>Login</li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;