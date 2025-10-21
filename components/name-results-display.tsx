'use client';

import { Heart, Volume2, Star, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NameResultsDisplayProps {
  names: any[];
  onNameClick: (name: any) => void;
  onToggleFavorite: (name: any) => void;
  isFavorite: (nameId: number) => boolean;
  favorites: any[];
}

export function NameResultsDisplay({
  names,
  onNameClick,
  onToggleFavorite,
  isFavorite,
  favorites
}: NameResultsDisplayProps) {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {names.map((name) => (
          <Card
            key={name.id}
            className="group hover:shadow-xl transition-all cursor-pointer border-2 hover:border-red-200 relative overflow-hidden"
            onClick={() => onNameClick(name)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="relative">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="text-xs">
                  {name.style}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 hover:scale-110 transition-transform ${
                    isFavorite(name.id) ? 'text-red-500' : 'text-slate-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(name);
                  }}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(name.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="text-center space-y-2">
                <div className="text-5xl font-bold text-slate-900 mb-2">
                  {name.chinese}
                </div>
                <div className="text-xl text-slate-600 font-medium">
                  {name.pinyin}
                </div>
                <div className="text-sm text-slate-500">
                  {name.meaning}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {name.bilingualExplanation && (
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-red-50 to-amber-50 p-3 rounded-lg border-l-4 border-red-500">
                    <h5 className="font-semibold text-slate-900 mb-1 text-xs">中文解释</h5>
                    <p className="text-slate-700 text-xs leading-relaxed line-clamp-2">{name.bilingualExplanation.chinese}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-l-4 border-blue-500">
                    <h5 className="font-semibold text-slate-900 mb-1 text-xs">English</h5>
                    <p className="text-slate-700 text-xs leading-relaxed line-clamp-2">{name.bilingualExplanation.english}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Cultural Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${name.culturalScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{name.culturalScore}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Commonness</span>
                <span className="font-medium text-slate-900">{name.commonness}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Gender</span>
                <span className="font-medium text-slate-900">{name.gender}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 group-hover:bg-red-50 group-hover:text-red-600 group-hover:border-red-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Play Pronunciation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {favorites.length > 0 && (
        <Card className="bg-gradient-to-br from-red-50 to-amber-50 border-2 border-red-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <h3 className="text-xl font-semibold text-slate-900">Your Favorites ({favorites.length})</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-red-100"
                  onClick={() => onNameClick(fav)}
                >
                  <div className="text-2xl font-bold text-slate-900">{fav.chinese}</div>
                  <div className="text-xs text-slate-600">{fav.pinyin}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="text-xl font-semibold text-slate-900">Need More Options?</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-slate-700">
            Not finding the perfect name? Try adjusting your preferences or exploring different styles!
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="border-amber-300 hover:bg-amber-100">
              Try Different Style
            </Button>
            <Button variant="outline" className="border-amber-300 hover:bg-amber-100">
              Change Meanings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
