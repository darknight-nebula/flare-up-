'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Medal, Award, ArrowLeft, Crown, Sun, Moon, Clock, Target } from 'lucide-react'
import Link from "next/link"
import { useTheme } from "next-themes"

interface LeaderboardEntry {
  playerName: string
  email: string
  completedResults: string[]
  gamesPlayed: number
  completionTime: number
  photo?: string
  timestamp: number
}

interface UserProgress {
  playerName: string
  email: string
  completedResults: string[]
  gamesPlayed: number
  startDate: number
  photo?: string
  lastPlayed?: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({})
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('leaderboard')
    const savedProgress = localStorage.getItem('userFlamesProgress')
    const user = localStorage.getItem('user')
    
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard))
    }
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setMounted(true)
  }, [])

  const getResultColor = (result: string) => {
    const colors = {
      'Love': 'text-red-500',
      'Marriage': 'text-purple-500',
      'Affection': 'text-pink-500',
      'Friends': 'text-blue-500',
      'Enemies': 'text-orange-500',
      'Single': 'text-gray-500'
    }
    return colors[result as keyof typeof colors] || 'text-gray-500'
  }

  const getResultEmoji = (result: string) => {
    const emojis = {
      'Love': '❤️',
      'Marriage': '💍',
      'Affection': '💕',
      'Friends': '👫',
      'Enemies': '⚔️',
      'Single': '🙋‍♀️'
    }
    return emojis[result as keyof typeof emojis] || '🤔'
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-6 w-6 text-yellow-500" />
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />
    if (index === 2) return <Award className="h-6 w-6 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
  }

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCurrentUserProgress = () => {
    if (!currentUser || !userProgress[currentUser.email]) return null
    return userProgress[currentUser.email]
  }

  const currentProgress = getCurrentUserProgress()
  const allFlamesResults = ['Friends', 'Love', 'Affection', 'Marriage', 'Enemies', 'Single']

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20">
      <header className="p-4 flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              FLAREUP Champions
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete all 6 FLAREUP results to join the hall of fame!
            </p>
          </div>

          {/* Current User Progress */}
          {currentProgress && (
            <Card className="mb-8 border-2 border-pink-200 dark:border-pink-800">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-pink-500" />
                  FLAREUP Challenge Progress
                </CardTitle>
                <CardDescription>
                  {currentProgress.completedResults.length === 6 
                    ? "🎉 Congratulations! You've completed all FLAMES results!" 
                    : `${currentProgress.completedResults.length}/6 FLAMES results completed`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{currentProgress.completedResults.length}/6</span>
                  </div>
                  <Progress value={(currentProgress.completedResults.length / 6) * 100} className="h-3" />
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                  {allFlamesResults.map((result) => {
                    const isCompleted = currentProgress.completedResults.includes(result)
                    return (
                      <div key={result} className={`text-center p-3 rounded-lg border-2 transition-all ${
                        isCompleted 
                          ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-200 dark:border-gray-700 opacity-50'
                      }`}>
                        <div className="text-2xl mb-1">{getResultEmoji(result)}</div>
                        <p className={`text-xs font-medium ${getResultColor(result)}`}>{result}</p>
                        {isCompleted && <div className="text-green-500 text-xs mt-1">✓</div>}
                      </div>
                    )
                  })}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span>Games Played: {currentProgress.gamesPlayed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span>Time Elapsed: {formatTime(Date.now() - currentProgress.startDate)}</span>
                  </div>
                </div>
                
                {currentProgress.completedResults.length < 6 && (
                  <div className="mt-4 text-center">
                    <Link href="/game">
                      <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                        Continue Playing ({6 - currentProgress.completedResults.length} more to go!)
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Leaderboard */}
          {leaderboard.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Champions Yet!</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to complete all 6 FLAREUP results and claim your spot on the leaderboard!
                </p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 max-w-md mx-auto mb-6">
                  {allFlamesResults.map((result) => (
                    <div key={result} className="text-center p-2 rounded border">
                      <div className="text-lg">{getResultEmoji(result)}</div>
                      <p className="text-xs">{result}</p>
                    </div>
                  ))}
                </div>
                <Link href="/game">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Start Your FLAREUP Journey
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center mb-6">🏆 Hall of Fame 🏆</h2>
              {leaderboard.map((entry, index) => (
                <Card key={index} className={`${index < 3 ? 'border-2' : ''} ${
                  index === 0 ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' :
                  index === 1 ? 'border-gray-300 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20' :
                  index === 2 ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20' :
                  ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankIcon(index)}
                        </div>
                        {entry.photo && (
                          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <img src={entry.photo || "/placeholder.svg"} alt={entry.playerName} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{entry.playerName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Completed in {formatTime(entry.completionTime)} • {entry.gamesPlayed} games
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary mb-1">
                          6/6 ✅
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(entry.timestamp)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {entry.completedResults.map((result) => (
                        <div key={result} className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <div className="text-lg">{getResultEmoji(result)}</div>
                          <p className={`text-xs font-medium ${getResultColor(result)}`}>{result}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How to Join the Leaderboard</CardTitle>
              <CardDescription>
                Complete the FLAREUP Challenge to become a champion!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Play FLAREUP with Different People</h4>
                    <p className="text-sm text-muted-foreground">Test your compatibility with various friends, crushes, or anyone!</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Collect All 6 FLAREUP Results</h4>
                    <p className="text-sm text-muted-foreground">You need to achieve Friends, Love, Affection, Marriage, Enemies, and Single</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Complete Faster to Rank Higher</h4>
                    <p className="text-sm text-muted-foreground">The leaderboard ranks players by completion time - speed matters!</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl mb-1">👫</div>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Friends</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">❤️</div>
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">Love</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">💕</div>
                  <p className="text-xs font-medium text-pink-600 dark:text-pink-400">Affection</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">💍</div>
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Marriage</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">⚔️</div>
                  <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Enemies</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🙋‍♀️</div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Single</p>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <Link href="/game">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Start Your Challenge!
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
