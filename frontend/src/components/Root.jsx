import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

export default function Root() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
