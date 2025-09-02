"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "@/lib/api/courses"

interface InstructorItem {
	name: string
	email: string
	role?: string
	bio?: string
	profession_name?: string
	expertise?: string | string[]
}

export default function InstitutionInstructorsPage() {
	const [instructors, setInstructors] = useState<InstructorItem[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string>("")

	useEffect(() => {
		const fetchInstructors = async () => {
  			try {
  			  setLoading(true)
  			  setError("")
  			  const token = localStorage.getItem("token")
  			  const res = await axios.get(`${API_URL}/api/institutions/instructors/all`, {
  			    headers: { Authorization: `Bearer ${token}` },
  			  })
  			  const rawData = res.data?.instructors || []
		  
  			  const data = rawData.map((ins: any) => ({
  			    name: ins.user_id?.name || "—",
  			    email: ins.user_id?.email || "—",
  			    bio: ins.bio,
  			    profession_name: ins.profession_name,
  			    expertise: ins.expertise,
  			  }))
		  
  			  setInstructors(data)
  			} catch (_e) {
  			  setError("Failed to load instructors")
  			} finally {
  			  setLoading(false)
  			}
		}
		fetchInstructors()
	}, [])

	return (
		<div className="min-h-screen p-6 bg-gray-50">
			<div className="max-w-6xl mx-auto">
				<header className="mb-6">
					<h1 className="text-xl font-semibold text-gray-900">Instructors</h1>
					<p className="text-sm text-gray-600">All instructors for your institution</p>
				</header>

				{loading && (
					<div className="text-gray-700 text-sm">Loading...</div>
				)}
				{!loading && error && (
					<div className="text-red-600 text-sm">{error}</div>
				)}

				{!loading && !error && (
					<section>
						<div className="border border-gray-200 rounded-lg bg-white">
							<div className="grid grid-cols-12 text-xs font-medium text-gray-600 border-b border-gray-200">
								<div className="col-span-4 px-4 py-3">Name</div>
								<div className="col-span-4 px-4 py-3">Email</div>
								<div className="col-span-4 px-4 py-3">Expertise</div>
							</div>
							{instructors.length === 0 ? (
								<div className="px-4 py-6 text-sm text-gray-500">No instructors found</div>
							) : (
								<ul className="divide-y divide-gray-200">
									{instructors.map((ins: InstructorItem, idx: number) => (
										<li key={`${ins.email}-${idx}`} className="grid grid-cols-12 items-center">
											<div className="col-span-4 px-4 py-3 text-sm text-gray-900 truncate">{ins.name}</div>
											<div className="col-span-4 px-4 py-3 text-sm text-gray-700 truncate">{ins.email}</div>
											<div className="col-span-4 px-4 py-3 text-sm text-gray-700 truncate">
												{Array.isArray(ins.expertise) ? ins.expertise.join(", ") : (ins.expertise || ins.profession_name || "—")}
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</section>
				)}
			</div>
		</div>
	)
}