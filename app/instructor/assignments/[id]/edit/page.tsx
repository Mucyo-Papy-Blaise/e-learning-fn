'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import TiptapEditor from '@/components/ui/TipTap.Editor'
import { toast } from 'react-toastify'

type Assignment = {
  _id: string
  title: string
  description: string
  instructions: string
  dueDate: string
  availableAfter: string
  points: number
  submissionType: 'text' | 'file' | 'url' | 'multiple'
  allowedAttempts: number
  status: 'draft' | 'published' | 'closed'
}

export default function EditAssignmentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [model, setModel] = useState<Assignment | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!id) return
    axiosInstance.get(`/api/assignments/${id}`).then(r => { if (mounted) setModel(r.data) }).catch(() => toast.error('Failed to load assignment'))
    return () => { mounted = false }
  }, [id])

  const handleSave = async () => {
    if (!model) return
    setSaving(true)
    try {
      await axiosInstance.put(`/api/assignments/${model._id}`, {
        title: model.title,
        description: model.description,
        instructions: model.instructions,
        dueDate: model.dueDate,
        availableAfter: model.availableAfter,
        points: model.points,
        submissionType: model.submissionType,
        allowedAttempts: model.allowedAttempts,
        status: model.status,
      })
      toast.success('Assignment updated')
      router.push(`/instructor/assignments/${model._id}`)
    } catch (e: any) {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!model) return
    if (!confirm('Delete this assignment? This action cannot be undone.')) return
    try {
      await axiosInstance.delete(`/api/assignments/${model._id}`)
      toast.success('Assignment deleted')
      router.push('/instructor/assignments')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (!model) return (<div className="p-4 md:p-6"><div className="max-w-3xl mx-auto">Loading...</div></div>)

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Edit Assignment</h1>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label>Title</Label>
              <Input value={model.title} onChange={(e) => setModel({ ...model, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={model.description} onChange={(e) => setModel({ ...model, description: e.target.value })} />
            </div>
            <div>
              <Label>Instructions</Label>
              <TiptapEditor name="instructions" content={model.instructions} onChange={(v) => setModel({ ...model, instructions: v })} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Due date</Label>
                <Input type="datetime-local" value={model.dueDate?.slice(0,16)} onChange={(e) => setModel({ ...model, dueDate: e.target.value })} />
              </div>
              <div>
                <Label>Available after</Label>
                <Input type="datetime-local" value={model.availableAfter?.slice(0,16)} onChange={(e) => setModel({ ...model, availableAfter: e.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Points</Label>
                <Input type="number" value={model.points} onChange={(e) => setModel({ ...model, points: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Allowed attempts</Label>
                <Input type="number" value={model.allowedAttempts} onChange={(e) => setModel({ ...model, allowedAttempts: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Status</Label>
                <select className="w-full border rounded-md px-3 py-2" value={model.status} onChange={(e) => setModel({ ...model, status: e.target.value as any })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Submission type</Label>
              <select className="w-full border rounded-md px-3 py-2" value={model.submissionType} onChange={(e) => setModel({ ...model, submissionType: e.target.value as any })}>
                <option value="text">Text</option>
                <option value="file">File</option>
                <option value="url">URL</option>
                <option value="multiple">Multiple</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

