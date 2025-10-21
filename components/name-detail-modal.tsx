'use client';

import { Heart, Volume2, X, Star, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

interface NameDetailModalProps {
  name: any;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export function NameDetailModal({
  name,
  isOpen,
  onClose,
  onToggleFavorite,
  isFavorite
}: NameDetailModalProps) {
  if (!name) return null;

  const fiveElementsData = [
    { name: 'Wood 木', value: name.fiveElements.wood, color: 'bg-green-500' },
    { name: 'Fire 火', value: name.fiveElements.fire, color: 'bg-red-500' },
    { name: 'Earth 土', value: name.fiveElements.earth, color: 'bg-yellow-600' },
    { name: 'Metal 金', value: name.fiveElements.metal, color: 'bg-slate-400' },
    { name: 'Water 水', value: name.fiveElements.water, color: 'bg-blue-500' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <div className="text-6xl font-bold text-slate-900">{name.chinese}</div>
            <div className="text-2xl text-slate-600">{name.pinyin}</div>
            <div className="text-lg text-slate-500">{name.meaning}</div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="lg"
              className={`${isFavorite ? 'text-red-500' : 'text-slate-400'} hover:scale-110 transition-transform`}
              onClick={onToggleFavorite}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="space-y-6 mt-6">
          <div className="flex gap-2">
            <Badge variant="secondary">{name.style}</Badge>
            <Badge variant="outline">{name.gender}</Badge>
            <Badge variant="outline">{name.commonness}</Badge>
          </div>

          <Card className="bg-gradient-to-br from-red-50 to-amber-50 border-red-100">
            <CardContent className="pt-6">
              <Button
                variant="default"
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                Play Pronunciation
              </Button>
            </CardContent>
          </Card>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-slate-900">
              <BookOpen className="w-5 h-5 text-red-600" />
              Full Meaning / 完整含义
            </h3>
            {name.bilingualFullMeaning ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-slate-900 mb-2">中文解释</h4>
                  <p className="text-slate-700 leading-relaxed">{name.bilingualFullMeaning.chinese}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-slate-900 mb-2">English Explanation</h4>
                  <p className="text-slate-700 leading-relaxed">{name.bilingualFullMeaning.english}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-700 leading-relaxed">{name.fullMeaning}</p>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Character Analysis / 字符分析
            </h3>
            <div className="space-y-4">
              {name.characters.map((char: any, index: number) => (
                <Card key={index} className="border-2 hover:border-red-200 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl font-bold text-slate-900 flex-shrink-0">
                        {char.char}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <span className="font-semibold text-slate-900">Meaning: </span>
                          <span className="text-slate-700">{char.meaning}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">Origin: </span>
                          <span className="text-slate-600 italic">{char.origin}</span>
                        </div>
                        {char.bilingualExplanation && (
                          <div className="space-y-3 mt-4">
                            <div className="bg-gradient-to-r from-red-50 to-amber-50 p-3 rounded-lg border-l-4 border-red-500">
                              <h5 className="font-semibold text-slate-900 mb-1 text-sm">中文解释</h5>
                              <p className="text-slate-700 text-sm leading-relaxed">{char.bilingualExplanation.chinese}</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-l-4 border-blue-500">
                              <h5 className="font-semibold text-slate-900 mb-1 text-sm">English Explanation</h5>
                              <p className="text-slate-700 text-sm leading-relaxed">{char.bilingualExplanation.english}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Star className="w-5 h-5 text-yellow-600" />
              Cultural & Harmony Analysis
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Cultural Score</span>
                      <span className="text-sm font-bold text-slate-900">{name.culturalScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-red-600 h-3 rounded-full transition-all"
                        style={{ width: `${name.culturalScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Lucky Score</span>
                      <span className="text-sm font-bold text-slate-900">{name.luckyScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-amber-600 h-3 rounded-full transition-all"
                        style={{ width: `${name.luckyScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-sm font-medium text-slate-700">Total Strokes: </span>
                    <span className="text-sm font-bold text-slate-900">{name.strokeCount}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-sm font-semibold mb-3 text-slate-900">Five Elements (五行)</h4>
                  <div className="space-y-3">
                    {fiveElementsData.map((element) => (
                      <div key={element.name}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-slate-700">{element.name}</span>
                          <span className="font-medium text-slate-900">{element.value}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`${element.color} h-2 rounded-full transition-all`}
                            style={{ width: `${(element.value / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Famous Users & Popularity / 历史名人</h3>
            {name.bilingualFamousUsers ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-slate-900 mb-2">中文说明</h4>
                  <p className="text-slate-700 leading-relaxed">{name.bilingualFamousUsers.chinese}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-slate-900 mb-2">English Description</h4>
                  <p className="text-slate-700 leading-relaxed">{name.bilingualFamousUsers.english}</p>
                </div>
              </div>
            ) : (
              <Card className="bg-slate-50">
                <CardContent className="pt-6">
                  <p className="text-slate-700">{name.famousUsers}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => {
                alert('Name sharing feature coming soon!');
              }}
            >
              Share This Name
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
