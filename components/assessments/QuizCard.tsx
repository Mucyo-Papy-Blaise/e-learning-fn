'use client'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Quiz } from '@/lib/types/assessments'

type Props = {
  quiz: Quiz
  href?: string
}

export default function QuizCard({ quiz, href }: Props) {
  const link = href ?? `/app/student/quizzes/${quiz._id}`.replace('/app', '')
  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        {quiz.description && <p>{quiz.description}</p>}
        <div className="grid grid-cols-2 gap-2">
          <div>Time limit: <span className="font-medium">{quiz.time_limit} min</span></div>
          <div>Pass: <span className="font-medium">{quiz.pass_percentage}%</span></div>
          <div>Max attempts: <span className="font-medium">{quiz.max_attempts}</span></div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href={link}>Start</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

