'use client'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Exam } from '@/lib/types/assessments'

type Props = {
  exam: Exam
  href?: string
  cta?: string
}

export default function ExamCard({ exam, href, cta = 'Open' }: Props) {
  const link = href ?? `/app/student/exams/${exam._id}`.replace('/app', '')
  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{exam.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        {exam.description && <p>{exam.description}</p>}
        <div className="grid grid-cols-2 gap-2">
          {exam.duration != null && (
            <div>Duration: <span className="font-medium">{exam.duration} min</span></div>
          )}
          {exam.passingScore != null && (
            <div>Pass: <span className="font-medium">{exam.passingScore}</span></div>
          )}
          {exam.startDate && (
            <div>Starts: <span className="font-medium">{new Date(exam.startDate).toLocaleString()}</span></div>
          )}
          {exam.endDate && (
            <div>Ends: <span className="font-medium">{new Date(exam.endDate).toLocaleString()}</span></div>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button asChild>
          <Link href={link}>{cta}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

