'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Heart, Flame, Sparkles, Crown, Star, Zap, Trophy, Users, TrendingUp, Sun, Moon } from 'lucide-react'
import Link from "next/link"
import { useTheme } from "next-themes"
import { AudioPlayer } from "@/components/audio-player"

export default function HomePage() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login/signup
    localStorage.setItem('user', JSON.stringify({ 
      name: formData.name || 'User', 
      email: formData.email,
      joinDate: new Date().toLocaleDateString()
    }))
    setIsLoggedIn(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Show login/signup form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-pink-300/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-300/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-40 w-40 h-40 bg-indigo-300/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-pink-400/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/20 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-indigo-400/20 rounded-full animate-ping"></div>
          
          {/* Floating Hearts */}
          <div className="absolute top-1/4 left-1/4 animate-float">
            <Heart className="w-8 h-8 text-pink-400/50" />
          </div>
          <div className="absolute top-3/4 right-1/4 animate-float delay-500">
            <Heart className="w-6 h-6 text-red-400/50" />
          </div>
          <div className="absolute top-1/2 left-3/4 animate-float delay-1000">
            <Sparkles className="w-7 h-7 text-purple-400/50" />
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-110"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-purple-600" />}
            </Button>
          )}
        </div>

        <Card className="w-full max-w-md relative z-10 shadow-2xl border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20 transform hover:scale-105 transition-all duration-300">
          <CardHeader className="text-center bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-t-lg">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-spin-slow">
                  <Flame className="h-8 w-8 text-white animate-pulse" />
                </div>
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-pulse">
                FLAREUP
              </h1>
              <div className="relative">
                <Crown className="h-8 w-8 text-yellow-500 animate-bounce" />
                <Star className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-ping" />
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {isSignUp ? '🌟 Join the Chaos! 🌟' : '✨ Welcome Back! ✨'}
            </CardTitle>
            <CardDescription className="text-base font-medium">
              {isSignUp 
                ? '🔥 Create your account to start discovering brutal compatibility truths! 🔥'
                : '💫 Sign in to continue your FLAREUP journey of romantic destruction! 💫'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Name ✨
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your magical name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border-2 border-purple-200 focus:border-purple-400 transition-all duration-300 hover:border-purple-300"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  Email 💌
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-2 border-purple-200 focus:border-purple-400 transition-all duration-300 hover:border-purple-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Password 🔐
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border-2 border-purple-200 focus:border-purple-400 transition-all duration-300 hover:border-purple-300"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isSignUp ? '🚀 Sign Up & Start the Chaos! 🚀' : '✨ Sign In & Continue Destruction! ✨'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
              >
                {isSignUp 
                  ? '💫 Already have an account? Sign in 💫'
                  : "🌟 Don't have an account? Sign up 🌟"
                }
              </Button>
            </div>
            
            {/* Preview of what's coming */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <p className="text-center text-sm font-medium text-yellow-800 dark:text-yellow-200">
                🔥 Get ready for BRUTAL relationship truths! 🔥
              </p>
              <p className="text-center text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                We'll roast your love life harder than a marshmallow! 💀
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Audio Player */}
        <AudioPlayer />

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
        `}</style>
      </div>
    )
  }

  // Show main homepage after login
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-300/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-300/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-indigo-300/30 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-32 w-12 h-12 bg-pink-400/30 rounded-full animate-bounce delay-1000"></div>
        
        {/* Floating Hearts */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Heart className="w-8 h-8 text-pink-400/50" />
        </div>
        <div className="absolute top-3/4 right-1/4 animate-float delay-500">
          <Heart className="w-6 h-6 text-red-400/50" />
        </div>
        <div className="absolute top-1/2 left-3/4 animate-float delay-1000">
          <Sparkles className="w-7 h-7 text-purple-400/50" />
        </div>
      </div>

      <header className="p-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-spin-slow">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            FLAREUP
          </span>
        </div>
        <div className="flex items-center gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:scale-110 transition-transform"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          <Link href="/profile">
            <Button variant="outline" className="border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300">
              Profile
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8 relative">
              <div className="text-8xl mb-4 animate-bounce">🔥</div>
              <div className="absolute -top-4 -right-4 animate-spin-slow">
                <Crown className="w-12 h-12 text-yellow-500" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-pulse">
              FLAREUP
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The most <span className="font-bold text-pink-500 animate-pulse">BRUTAL</span> and 
              <span className="font-bold text-purple-500 animate-pulse"> HILARIOUS</span> relationship 
              compatibility game that tells you the <span className="font-bold text-red-500">TRUTH</span> 
              about your love life! 💀❤️
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/game">
                <Button 
                  size="lg" 
                  className="text-xl px-8 py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse"
                >
                  <Flame className="mr-2 h-6 w-6 animate-bounce" />
                  Start the Chaos!
                </Button>
              </Link>
              
              <Link href="/leaderboard">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-xl px-8 py-6 border-2 border-purple-500 hover:bg-purple-500 hover:text-white transform hover:scale-105 transition-all duration-300"
                >
                  <Trophy className="mr-2 h-6 w-6" />
                  Hall of Fame
                </Button>
              </Link>
            </div>
          </div>

          {/* What is FLAREUP Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              What is FLAREUP? 🤔
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-pink-200 dark:border-pink-800">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-pink-600 dark:text-pink-400">F - Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    The classic friend zone! Someone's getting their heart broken... 💔
                  </p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-red-200 dark:border-red-800">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-red-600 dark:text-red-400">L - Love</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    True love or just hormones? We'll tell you the brutal truth! 😍
                  </p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-purple-600 dark:text-purple-400">A - Affection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Sweet but boring... the participation trophy of relationships! 🏆
                  </p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-indigo-200 dark:border-indigo-800">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-indigo-600 dark:text-indigo-400">R - Romance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Candlelit dinners and poetry... or just Netflix and chill? 🕯️
                  </p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-orange-200 dark:border-orange-800">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-orange-600 dark:text-orange-400">E - Enemies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    You hate each other! At least you're honest about it... ⚔️
                  </p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-gray-200 dark:border-gray-800">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-600 dark:text-gray-400">U - Unattached</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Forever alone! Time to adopt some cats... 🐱
                  </p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-yellow-200 dark:border-yellow-800">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Flame className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-yellow-600 dark:text-yellow-400">P - Passion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Fire and intensity! But will it burn out quickly? 🔥
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Why FLAREUP is LEGENDARY 🚀
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-2 border-pink-300 dark:border-pink-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                    <Flame className="h-6 w-6 animate-bounce" />
                    Brutally Honest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    No sugar-coating here! We tell you the TRUTH about your relationship, 
                    even if it hurts. Prepare for some savage roasts! 💀
                  </p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-300 dark:border-purple-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                    Hilariously Unhinged
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our predictions are so wild and funny, you'll be crying from laughter! 
                    We predict your future with zero filter! 😂
                  </p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-2 border-indigo-300 dark:border-indigo-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <TrendingUp className="h-6 w-6 animate-bounce" />
                    Always Different
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Every time you play, you get different brutal comments and predictions! 
                    The chaos never ends! 🎲
                  </p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Heart className="h-6 w-6 animate-pulse" />
                    Photo Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Upload photos to make it personal! See your faces next to the brutal truth 
                    about your relationship! 📸
                  </p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <Trophy className="h-6 w-6 animate-bounce" />
                    Leaderboard Fame
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Complete all relationship types to join the Hall of Fame! 
                    Show off your romantic chaos to the world! 🏆
                  </p>
                </CardContent>
              </Card>

              <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-300 dark:border-red-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <Star className="h-6 w-6 animate-pulse" />
                    Future Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    See what your relationship will look like in 10 years! 
                    Spoiler: it's probably chaos! 🔮
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Fun Stats Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              FLAREUP by the Numbers 📊
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/30 dark:to-red-900/30">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2 animate-pulse">
                    1M+
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Hearts Broken 💔</p>
                </CardContent>
              </Card>

              <Card className="text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2 animate-bounce">
                    500K+
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Friend Zones Created 😅</p>
                </CardContent>
              </Card>

              <Card className="text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2 animate-pulse">
                    99.9%
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Accuracy Rate 🎯</p>
                </CardContent>
              </Card>

              <Card className="text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2 animate-bounce">
                    ∞
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Laughs Generated 😂</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <CardContent className="pt-8 pb-8">
                <h2 className="text-4xl font-bold mb-4 animate-pulse">
                  Ready for the TRUTH? 🔥
                </h2>
                <p className="text-xl mb-6 opacity-90">
                  Don't say we didn't warn you... This game will DESTROY your delusions! 💀
                </p>
                <Link href="/game">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="text-xl px-12 py-6 bg-white text-purple-600 hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl font-bold"
                  >
                    <Flame className="mr-2 h-6 w-6 animate-bounce" />
                    IGNITE THE CHAOS!
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Audio Player */}
      <AudioPlayer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
