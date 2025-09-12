"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { API_URL } from "@/lib/api/courses"

interface InstructorItem {
	name: string
	email: string
	profession_name?: string
	bio?: string
	profile_image?: string
	expertise?: string[]
	rating?: number
	total_students?: number
}

export default function InstitutionInstructorsPage() {
	const [instructors, setInstructors] = useState<InstructorItem[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string>("")

	useEffect(() => {
		const parseExpertise = (exp: any): string[] => {
			try {
				if (Array.isArray(exp)) {
					const out: string[] = []
					for (const item of exp) {
						if (typeof item === 'string' && item.trim().startsWith('[')) {
							const parsed = JSON.parse(item)
							if (Array.isArray(parsed)) out.push(...parsed.map((s: any) => String(s)))
						} else if (typeof item === 'string') {
							out.push(item)
						}
					}
					return out
				}
				if (typeof exp === 'string') {
					if (exp.trim().startsWith('[')) {
						const parsed = JSON.parse(exp)
						return Array.isArray(parsed) ? parsed.map((s: any) => String(s)) : [String(exp)]
					}
					return [exp]
				}
				return []
			} catch { return [] }
		}

		const fetchInstructors = async () => {
			try {
				setLoading(true)
				setError("")
				const token = localStorage.getItem("token")
				const res = await axios.get(`${API_URL}/api/institutions/instructors/all`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				const payload = res.data
				const rawData = Array.isArray(payload) ? payload : (payload?.data?.instructors || payload?.instructors || [])
				
				const data: InstructorItem[] = rawData.map((ins: any) => ({
					name: ins?.user_id?.name || "—",
					email: ins?.user_id?.email || "—",
					bio: ins?.bio,
					profession_name: ins?.profession_name,
					profile_image: ins?.profile_image,
					expertise: parseExpertise(ins?.expertise),
					rating: typeof ins?.rating === 'number' ? ins.rating : undefined,
					total_students: typeof ins?.total_students === 'number' ? ins.total_students : undefined,
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
					<div className="flex items-start justify-between gap-4">
						<div>
							<h1 className="text-xl font-semibold text-gray-900">Instructors</h1>
							<p className="text-sm text-gray-600">All instructors for your institution</p>
						</div>
						<Link href="/institution/instructors/new" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Add New Instructor</Link>
					</div>
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
							{instructors.length === 0 ? (
								<div className="px-4 py-6 text-sm text-gray-500">No instructors found</div>
							) : (
								<ul className="divide-y divide-gray-200">
									{instructors.map((ins: InstructorItem, idx: number) => (
										<li key={`${ins.email}-${idx}`} className="px-4 py-4">
											<div className="flex items-start gap-4">
												{ins.profile_image ? (
													// eslint-disable-next-line @next/next/no-img-element
													<img src={ins.profile_image} alt={ins.name} className="h-12 w-12 rounded-full object-cover" />
												) : (
													<div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
														{ins.name?.substring(0,2).toUpperCase()}
													</div>
												)}
												<div className="flex-1 min-w-0">
													<div className="flex flex-wrap items-center gap-2">
														<p className="text-sm font-medium text-gray-900 truncate">{ins.name}</p>
														{ins.profession_name && <span className="text-xs text-gray-600">• {ins.profession_name}</span>}
													</div>
													<p className="text-xs text-gray-600 truncate">{ins.email}</p>
													{ins.bio && <p className="mt-2 text-sm text-gray-700 line-clamp-2">{ins.bio}</p>}
													{ins.expertise && ins.expertise.length > 0 && (
														<div className="mt-2 flex flex-wrap gap-2">
															{ins.expertise.map((tag: string) => (
																<span key={tag} className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">{tag}</span>
															))}
														</div>
													)}
												</div>
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