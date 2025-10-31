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
    <Card className="max-w-3xl mx-auto shadow-2xl border-2 border-red-100/50 bg-white/95 backdrop-blur-sm overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 px-4 md:px-6 py-4 md:py-6 text-white">
        <CardHeader className="text-center pb-0 px-0">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-2 text-xs md:text-sm font-medium">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            Create Your Identity
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-2 text-white">
            Generate Your Chinese Name
          </CardTitle>
          <CardDescription className="text-sm md:text-base text-red-50 max-w-xl mx-auto">
            Fill in your information to get personalized name suggestions
          </CardDescription>
        </CardHeader>
      </div>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="englishName" className="text-slate-700 font-medium text-sm">English Name (Optional)</Label>
            <Input
              id="englishName"
              placeholder="e.g., Sarah, Michael"
              value={formData.englishName}
              onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
              className="h-10 md:h-11 border-slate-200 focus:border-red-400 focus:ring-red-400 text-sm"
            />
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              We'll try to create names that sound similar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="gender" className="text-slate-700 font-medium text-sm">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger id="gender" className="h-10 md:h-11 border-slate-200 focus:border-red-400 focus:ring-red-400 text-sm">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="unisex">Unisex / Non-binary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nationality" className="text-slate-700 font-medium text-sm">Nationality (Optional)</Label>
              <Select value={formData.nationality} onValueChange={(value) => setFormData({ ...formData, nationality: value })}>
                <SelectTrigger id="nationality" className="h-10 md:h-11 border-slate-200 focus:border-red-400 focus:ring-red-400 text-sm">
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

          <div className="space-y-1.5">
            <Label className="text-slate-700 font-medium text-sm">Desired Meanings (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1">
              {meaningOptions.map((meaning) => (
                <div 
                  key={meaning} 
                  className={`flex items-center space-x-2 p-2 rounded-lg border-2 transition-all cursor-pointer ${
                    formData.meanings.includes(meaning)
                      ? 'border-red-400 bg-red-50'
                      : 'border-slate-200 bg-slate-50 hover:border-red-200 hover:bg-red-50/50'
                  }`}
                >
                  <Checkbox
                    id={meaning}
                    checked={formData.meanings.includes(meaning)}
                    onCheckedChange={() => toggleMeaning(meaning)}
                    className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                  <label
                    htmlFor={meaning}
                    className={`text-xs font-medium leading-none cursor-pointer flex-1 ${
                      formData.meanings.includes(meaning) ? 'text-red-700' : 'text-slate-700'
                    }`}
                  >
                    {meaning}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="style" className="text-slate-700 font-medium text-sm">Name Style</Label>
            <Select value={formData.style} onValueChange={(value) => setFormData({ ...formData, style: value })}>
              <SelectTrigger id="style" className="h-10 md:h-11 border-slate-200 focus:border-red-400 focus:ring-red-400 text-sm">
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
            className="w-full bg-red-600 hover:bg-red-700 text-white h-11 md:h-12 text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all mt-4"
          >
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Generate My Chinese Names
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
