import Link from 'next/link'

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link href="/">Dashboard</Link></li>
        <li><Link href="/projects">Projects</Link></li>
        <li><Link href="/accounts">Accounts</Link></li>
        {/* Добавьте другие пункты меню по необходимости */}
      </ul>
    </nav>
  )
}

