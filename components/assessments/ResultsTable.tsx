'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type ResultRow = {
  id: string
  type: 'quiz' | 'exam'
  title: string
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  date?: string
}

type Props = {
  rows: ResultRow[]
}

export default function ResultsTable({ rows }: Props) {
  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Percent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="capitalize">{r.type}</TableCell>
              <TableCell>{r.title}</TableCell>
              <TableCell>{r.score} / {r.maxScore}</TableCell>
              <TableCell>{Math.round(r.percentage)}%</TableCell>
              <TableCell>
                <span className={r.passed ? 'text-green-600' : 'text-red-600'}>
                  {r.passed ? 'Passed' : 'Failed'}
                </span>
              </TableCell>
              <TableCell>{r.date ? new Date(r.date).toLocaleString() : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

