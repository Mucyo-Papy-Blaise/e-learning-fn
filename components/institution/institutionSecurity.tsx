"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface SecuritySettingsProps {
  personalData: {
    email: string;
    phone: string;
    password?: string;
    confirmPassword?: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function SecuritySettings({
  personalData,
  onChange,
}: SecuritySettingsProps) {
  return (
    <Card className="shadow-md rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={personalData.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Enter contact email"
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            value={personalData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Enter contact phone"
          />
        </div>

        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            value={personalData.password || ""}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={personalData.confirmPassword || ""}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
      </CardContent>
    </Card>
  );
}
