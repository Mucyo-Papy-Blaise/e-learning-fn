"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface CompanyInfoProps {
  personalData: {
    name: string;
    bio: string;
  };
  profileImage: string | null;
  onChange: (field: string, value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CompanyInfo({
  personalData,
  profileImage,
  onChange,
  onFileChange,
}: CompanyInfoProps) {
  return (
    <Card className="shadow-md rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <div>
          <Label>Company Logo</Label>
          <div className="flex items-center gap-4 mt-2">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Logo"
                className="w-24 h-24 rounded-xl object-cover shadow"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-sm text-gray-400">
                No Logo
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="text-sm"
            />
          </div>
        </div>

        <div>
          <Label>Name</Label>
          <Input
            value={personalData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter institution name"
          />
        </div>

        <div>
          <Label>Bio</Label>
          <Textarea
            value={personalData.bio}
            onChange={(e) => onChange("bio", e.target.value)}
            placeholder="Short description about institution"
          />
        </div>
      </CardContent>
    </Card>
  );
}
