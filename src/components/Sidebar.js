import Link from 'next/link';

export default function Sidebar() {
  return (
    <nav className="sidebar bg-light p-3 vh-100">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link href="/" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/projects" className="nav-link">
            Projects
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/accounts" className="nav-link">
            Accounts
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/employees" className="nav-link">
            👥 Employees
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/skills" className="nav-link">
            🎯 Skills
          </Link>
        </li>
        {/* Добавьте другие пункты меню по необходимости */}
      </ul>
    </nav>
  );
}
