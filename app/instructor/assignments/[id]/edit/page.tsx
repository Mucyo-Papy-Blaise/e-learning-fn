"use client"
import AssignmentForm from '@/components/assignments/instructor/CreateAssignmentForm'
import { useParams } from 'next/navigation'

export default function EditAssignmentPage() {
  const params = useParams()
  const assignmentId = params?.id as string

  return (
    <AssignmentForm 
      isEditing={true}
      assignmentId={assignmentId}
    />
  )
}