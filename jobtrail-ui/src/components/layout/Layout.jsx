import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex h-full bg-zinc-950">
      <Sidebar />
      <main className="flex-1 ml-60 overflow-y-auto min-h-full">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-8 max-w-7xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
