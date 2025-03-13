import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface InputWithButtonProps {
  className?: string;
  handleLocation: (location: string) => void;
}

export function InputWithButton({ className, handleLocation }: InputWithButtonProps) {
  const [location, setLocation] = useState("");

  function handleSearch() {
    if (!location.trim()) return;
    handleLocation(location); // 🔥 Calls search instantly
    setLocation("");
  }

  return (
    <div className={`flex p-[10px] w-full max-w-sm items-center ${className}`}>
      <Input
        placeholder="Search Location"
        onChange={(e) => setLocation(e.target.value)}
        value={location}
        className="border bg-white"
      />
      <Button type="button" onClick={handleSearch} className="bg-white border rounded-full">
        <Search className="w-5 h-5 text-black" />
      </Button>
    </div>
  );
}
