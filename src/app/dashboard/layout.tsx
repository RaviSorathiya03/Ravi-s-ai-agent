'use client'
import { Authenticated } from "convex/react"

export default function DashboardLayout({
    children
}:{
    children:React.ReactNode
}){
    return <div>
        <Authenticated>
            <h1>Hello</h1>
            {/* <Sidebar /> */}
        </Authenticated>
        <main>
        {/* <Header /> */}
        {children}
        </main>
    </div>
}