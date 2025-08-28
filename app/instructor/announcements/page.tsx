"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function InstructorAnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-2xl font-semibold text-[color:var(--brand-navy)]">Announcements</h1>
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Create Announcement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full h-11 px-3 border border-gray-300 rounded-md" />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="w-full min-h-28 p-3 border border-gray-300 rounded-md" />
          <div className="flex justify-end">
            <Button className="bg-[color:var(--brand-blue)] hover:opacity-90">Post</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

