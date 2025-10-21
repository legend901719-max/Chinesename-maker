'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface NameGeneratorFormProps {
  onGenerate: (formData: any) => void;
}

export function NameGeneratorForm({ onGenerate }: NameGeneratorFormProps) {
  const [formData, setFormData] = useState({
    englishName: '',
    gender: '',
    nationality: '',
    meanings: [] as string[],
    style: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const meaningOptions = [
    'Smart/Intelligent',
    'Kind/Gentle',
    'Brave/Strong',
    'Natural/Peaceful',
    'Artistic/Creative',
    'Prosperous/Successful',
    'Beautiful/Elegant',
    'Wise/Thoughtful'
  ];

  const toggleMeaning = (meaning: string) => {
    setFormData(prev => ({
      ...prev,
      meanings: prev.meanings.includes(meaning)
        ? prev.meanings.filter(m => m !== meaning)
        : [...prev.meanings, meaning]
    }));
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-xl border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Generate Your Chinese Name</CardTitle>
        <CardDescription className="text-base">
          Fill in your information to get personalized name suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="englishName">English Name (Optional)</Label>
            <Input
              id="englishName"
              placeholder="e.g., Sarah, Michael"
              value={formData.englishName}
              onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
              className="h-12"
            />
            <p className="text-sm text-slate-500">We'll try to create names that sound similar</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger id="gender" className="h-12">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="unisex">Unisex / Non-binary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality (Optional)</Label>
              <Select value={formData.nationality} onValueChange={(value) => setFormData({ ...formData, nationality: value })}>
                <SelectTrigger id="nationality" className="h-12">
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="spain">Spain</SelectItem>
                  <SelectItem value="italy">Italy</SelectItem>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="korea">South Korea</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Desired Meanings (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {meaningOptions.map((meaning) => (
                <div key={meaning} className="flex items-center space-x-2">
                  <Checkbox
                    id={meaning}
                    checked={formData.meanings.includes(meaning)}
                    onCheckedChange={() => toggleMeaning(meaning)}
                  />
                  <label
                    htmlFor={meaning}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {meaning}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Name Style</Label>
            <Select value={formData.style} onValueChange={(value) => setFormData({ ...formData, style: value })}>
              <SelectTrigger id="style" className="h-12">
                <SelectValue placeholder="Select style preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classical">Classical / Traditional</SelectItem>
                <SelectItem value="modern">Modern / Contemporary</SelectItem>
                <SelectItem value="poetic">Poetic / Literary</SelectItem>
                <SelectItem value="cute">Cute / Sweet</SelectItem>
                <SelectItem value="strong">Strong / Powerful</SelectItem>
                <SelectItem value="simple">Simple / Minimalist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate My Chinese Names
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
