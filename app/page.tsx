'use client';

import { useState, useRef } from 'react';
import { Sparkles, Users, BookOpen, Heart, Star, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NameGeneratorForm } from '@/components/name-generator-form';
import { NameResultsDisplay } from '@/components/name-results-display';
import { NameDetailModal } from '@/components/name-detail-modal';

export default function Home() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<any[]>([]);
  const [selectedName, setSelectedName] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleGenerateNames = async (formData: any) => {
    try {
      setShowGenerator(true);
      setIsLoading(true);
      
      // 显示加载状态
      setGeneratedNames([]);
      
      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('生成姓名失败');
      }

      const data = await response.json();
      setGeneratedNames(data.names);
    } catch (error) {
      console.error('生成姓名时出错:', error);
      // 如果API调用失败，使用默认数据
      const defaultNames = [
        {
          id: 1,
          chinese: '美玲',
          pinyin: 'Měi Líng',
          meaning: 'Beautiful Bell',
          characters: [
            { char: '美', meaning: 'Beautiful, pretty', origin: 'Common in classical poetry' },
            { char: '玲', meaning: 'Tinkling of jade, delicate sound', origin: 'From ancient jade ornaments' }
          ],
          culturalScore: 92,
          style: 'Modern & Elegant',
          commonness: 'Very Common',
          gender: 'Female',
          fullMeaning: 'A name that evokes the image of delicate beauty and grace, like the tinkling sound of jade bells in the wind.',
          famousUsers: 'Popular among Chinese women born in 1980s-1990s',
          fiveElements: { wood: 2, fire: 1, earth: 1, metal: 1, water: 0 },
          strokeCount: 17,
          luckyScore: 88
        },
        {
          id: 2,
          chinese: '思远',
          pinyin: 'Sī Yuǎn',
          meaning: 'Thinking Far',
          characters: [
            { char: '思', meaning: 'Think, consider, miss', origin: 'From Confucian classics' },
            { char: '远', meaning: 'Far, distant, profound', origin: 'Common in philosophical texts' }
          ],
          culturalScore: 95,
          style: 'Classical & Profound',
          commonness: 'Common',
          gender: 'Unisex',
          fullMeaning: 'A philosophical name suggesting deep thinking and far-reaching vision. Often associated with wisdom and ambition.',
          famousUsers: 'Used by scholars and intellectuals throughout Chinese history',
          fiveElements: { wood: 1, fire: 2, earth: 1, metal: 1, water: 0 },
          strokeCount: 16,
          luckyScore: 91
        }
      ];
      setGeneratedNames(defaultNames);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameClick = (name: any) => {
    setSelectedName(name);
  };

  const handleToggleFavorite = (name: any) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === name.id);
      if (exists) {
        return prev.filter(f => f.id !== name.id);
      } else {
        return [...prev, name];
      }
    });
  };

  const isFavorite = (nameId: number) => {
    return favorites.some(f => f.id === nameId);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (showGenerator) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Button
              variant="outline"
              onClick={() => setShowGenerator(false)}
              className="mb-4"
            >
              ← Back to Home
            </Button>
            <h1 className="text-4xl font-bold mb-2 text-slate-900">Your Chinese Names</h1>
            <p className="text-slate-600">Click on any name to see detailed analysis</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">正在生成您的中文姓名...</h3>
              <p className="text-slate-600">AI正在分析您的偏好并生成个性化姓名</p>
            </div>
          ) : (
            <NameResultsDisplay
              names={generatedNames}
              onNameClick={handleNameClick}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
              favorites={favorites}
            />
          )}

          {selectedName && (
            <NameDetailModal
              name={selectedName}
              isOpen={!!selectedName}
              onClose={() => setSelectedName(null)}
              onToggleFavorite={() => handleToggleFavorite(selectedName)}
              isFavorite={isFavorite(selectedName.id)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-red-50 via-amber-50 to-yellow-50">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-full mb-3 text-xs md:text-sm font-medium">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              Discover Your Chinese Identity
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-slate-900">
              Find Your Perfect
              <span className="block text-red-600 mt-1">Chinese Name</span>
            </h1>

            <p className="text-sm md:text-base text-slate-600 mb-4 max-w-2xl mx-auto leading-relaxed">
              Generate meaningful Chinese names with cultural insights, pronunciation guides, and personalized recommendations
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Button
                size="lg"
                onClick={scrollToForm}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Generate My Name
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div ref={formRef} className="bg-gradient-to-b from-white via-red-50/30 to-amber-50/30 py-8 md:py-12 scroll-mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <NameGeneratorForm onGenerate={handleGenerateNames} />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-red-50 via-amber-50 to-yellow-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-600">500K+</div>
                <div className="text-sm text-slate-600">Names Generated</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-3xl font-bold text-amber-600">150+</div>
                <div className="text-sm text-slate-600">Countries</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-slate-600">Satisfaction</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">5.0</div>
                <div className="text-sm text-slate-600">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Why Choose a Chinese Name?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A Chinese name opens doors to deeper cultural understanding and connection
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Cultural Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Bridge cultures and show respect for Chinese heritage with a name that carries deep meaning and history.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle>Learning Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Perfect for students, expats, or anyone learning Chinese. A name makes language learning more personal.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Personal Identity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Create a unique identity that reflects your personality, values, and the traits you admire most.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Powerful Features</h2>
            <p className="text-lg text-slate-600">Everything you need to find your perfect Chinese name</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-slate-900">Smart Generation</h3>
                  <p className="text-sm text-slate-600">AI-powered name suggestions based on your preferences, gender, and desired meanings</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-slate-900">Cultural Analysis</h3>
                  <p className="text-sm text-slate-600">Detailed explanations of character meanings, origins from classical literature and poetry</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-slate-900">Pronunciation Guide</h3>
                  <p className="text-sm text-slate-600">Pinyin romanization and audio pronunciation to help you say your name correctly</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-slate-900">Harmony Score</h3>
                  <p className="text-sm text-slate-600">Traditional analysis including Five Elements, stroke count, and cultural harmony rating</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-slate-900">Save Favorites</h3>
                  <p className="text-sm text-slate-600">Collect and compare your favorite names before making your final choice</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-slate-900">Style Matching</h3>
                  <p className="text-sm text-slate-600">Choose from traditional, modern, poetic, or minimalist naming styles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discover Your Chinese Name?</h2>
          <p className="text-lg mb-8 text-red-50 max-w-2xl mx-auto">
            Join thousands of people who have found their perfect Chinese identity
          </p>
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-white text-red-600 hover:bg-red-50 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Now - It's Free
          </Button>
        </div>
      </div>
    </div>
  );
}
