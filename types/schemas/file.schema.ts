import z from 'zod'

export  const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  resource_type: z.enum(['pdf', 'doc', 'video', 'audio', 'other']),
  file: z.instanceof(File),
})
