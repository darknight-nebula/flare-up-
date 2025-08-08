'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, User, Mail, Calendar, Trophy, Heart, Sun, Moon, Target, Clock, Camera } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useTheme } from "next-themes"
import { AudioPlayer } from "@/components/audio-player"

interface User {
  name: string
  email: string
  joinDate?: string
  gamesPlayed?: number
  bestResult?: string
  photo?: string
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

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploadingPhoto(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoPreview(result)
        
        // Update user photo in localStorage
        if (user) {
          const updatedUser = { ...user, photo: result }
          setUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
          
          // Also update in FLAMES progress if it exists
          const savedProgress = localStorage.getItem('userFlamesProgress')
          if (savedProgress) {
            const allProgress = JSON.parse(savedProgress)
            if (allProgress[user.email]) {
              allProgress[user.email].photo = result
              localStorage.setItem('userFlamesProgress', JSON.stringify(allProgress))
              setUserProgress(allProgress[user.email])
            }
          }
        }
        setIsUploadingPhoto(false)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedProgress = localStorage.getItem('userFlamesProgress')
    
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const fullUser = {
        ...userData,
        joinDate: userData.joinDate || new Date().toLocaleDateString(),
        gamesPlayed: userData.gamesPlayed || 0,
        bestResult: userData.bestResult || 'None yet'
      }
      setUser(fullUser)
      setEditForm({ name: fullUser.name, email: fullUser.email })
      
      // Get user's FLAMES progress
      if (savedProgress) {
        const allProgress = JSON.parse(savedProgress)
        if (allProgress[userData.email]) {
          setUserProgress(allProgress[userData.email])
        }
      }
    } else {
      router.push('/')
    }
  }, [router])

  const handleSave = () => {
    if (user) {
      const updatedUser = { ...user, ...editForm }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setIsEditing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
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

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

  const allFlamesResults = ['Friends', 'Love', 'Affection', 'Marriage', 'Enemies', 'Single']

  if (!user) {
    return <div>Loading...</div>
  }

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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto mb-4 cursor-pointer" onClick={() => document.getElementById('photo-upload')?.click()}>
                <AvatarImage src={photoPreview || userProgress?.photo || user?.photo || "/placeholder-user.jpg"} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                onClick={() => document.getElementById('photo-upload')?.click()}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              {user.name}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground mt-1">Click photo to change</p>
          </div>

          <div className="grid gap-6">
            {/* FLAMES Progress Card */}
            {userProgress && (
              <Card className="border-2 border-pink-200 dark:border-pink-800">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-pink-500" />
                    FLAREUP Challenge Progress
                  </CardTitle>
                  <CardDescription>
                    {userProgress.completedResults.length === 6 
                      ? "🎉 Challenge Complete! You're on the leaderboard!" 
                      : `${userProgress.completedResults.length}/6 FLAREUP results collected`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{userProgress.completedResults.length}/6</span>
                    </div>
                    <Progress value={(userProgress.completedResults.length / 6) * 100} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                    {allFlamesResults.map((result) => {
                      const isCompleted = userProgress.completedResults.includes(result)
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
                      <span>Games Played: {userProgress.gamesPlayed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span>Time Elapsed: {formatTime(Date.now() - userProgress.startDate)}</span>
                    </div>
                  </div>
                  
                  {userProgress.completedResults.length < 6 && (
                    <div className="mt-4 text-center">
                      <Link href="/game">
                        <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                          Continue Challenge ({6 - userProgress.completedResults.length} more to go!)
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Manage your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="bg-gradient-to-r from-pink-500 to-purple-600">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg border">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg border">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Game Statistics
                </CardTitle>
                <CardDescription>
                  Your FLAREUP game achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg border">
                    <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{user.joinDate}</p>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{userProgress?.gamesPlayed || 0}</p>
                    <p className="text-sm text-muted-foreground">Games Played</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{userProgress?.completedResults.length || 0}/6</p>
                    <p className="text-sm text-muted-foreground">FLAREUP Collected</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/game">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Play FLAREUP Game
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" className="w-full">
                    View Leaderboard
                  </Button>
                </Link>
                <Button variant="destructive" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Audio Player */}
      <AudioPlayer />
    </div>
  )
}
