'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, Heart, ArrowLeft, Camera, Sun, Moon } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useTheme } from "next-themes"
import { AudioPlayer } from "@/components/audio-player"

export default function GamePage() {
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [photo1, setPhoto1] = useState<string | null>(null)
  const [photo2, setPhoto2] = useState<string | null>(null)
  const router = useRouter()

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, photoNumber: 1 | 2) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (photoNumber === 1) {
          setPhoto1(result)
        } else {
          setPhoto2(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const calculateFLAMES = () => {
    if (!name1.trim() || !name2.trim()) return

    // FLAMES algorithm with MORE randomization for different results each time
    const n1 = name1.toLowerCase().replace(/\s/g, '')
    const n2 = name2.toLowerCase().replace(/\s/g, '')
    
    let str1 = n1.split('')
    let str2 = n2.split('')
    
    // Remove common characters
    for (let i = 0; i < str1.length; i++) {
      for (let j = 0; j < str2.length; j++) {
        if (str1[i] === str2[j]) {
          str1[i] = '*'
          str2[j] = '*'
          break
        }
      }
    }
    
    const count = str1.filter(char => char !== '*').length + str2.filter(char => char !== '*').length
    
    // Add timestamp and random factors for different results each time
    const timestamp = Date.now()
    const randomSeed = Math.random() * 1000
    
    // Calculate individual percentages with MAXIMUM variation each time
    const flames = ['Friends', 'Love', 'Affection', 'Marriage', 'Enemies', 'Single']
    const percentages = flames.map((_, index) => {
      // Use multiple random factors for completely different results each time
      const nameLength1 = n1.length
      const nameLength2 = n2.length
      const totalLength = nameLength1 + nameLength2
      
      // Create highly variable seeds using timestamp and random numbers
      const timeSeed = Math.abs(Math.sin((timestamp + index * 7.3) * 0.001)) * 100
      const randomFactor = Math.abs(Math.cos((randomSeed + index * 5.7) * 0.9)) * 100
      const nameSeed = Math.abs(Math.sin((count + totalLength + index * 3.1) * 1.4)) * 100
      const extraRandom = Math.random() * 40 // Pure randomness
      
      // Combine all factors with different weights each time
      const weight1 = 0.2 + (Math.random() * 0.3) // 0.2-0.5
      const weight2 = 0.15 + (Math.random() * 0.25) // 0.15-0.4
      const weight3 = 0.1 + (Math.random() * 0.2) // 0.1-0.3
      const weight4 = 0.1 + (Math.random() * 0.15) // 0.1-0.25
      
      const combined = (timeSeed * weight1) + (randomFactor * weight2) + (nameSeed * weight3) + (extraRandom * weight4)
      
      // Add character-based bonus with randomization
      const charBonus = ((nameLength1 * nameLength2 * (index + 1)) % 35) + (Math.random() * 20)
      
      // Ensure wide range of percentages (10-92%)
      const finalPercentage = Math.max(10, Math.min(92, Math.round(combined + charBonus)))
      return finalPercentage
    })
    
    // Find the highest percentage
    const maxPercentage = Math.max(...percentages)
    const resultIndex = percentages.indexOf(maxPercentage)
    const result = flames[resultIndex]
    
    // Store detailed result with randomization markers
    const gameResult = {
      name1,
      name2,
      result,
      percentage: maxPercentage,
      detailedPercentages: {
        Friends: percentages[0],
        Love: percentages[1],
        Affection: percentages[2],
        Marriage: percentages[3],
        Enemies: percentages[4],
        Single: percentages[5]
      },
      photo1,
      photo2,
      timestamp,
      randomSeed, // Store for consistent brutality selection
      gameId: `${timestamp}_${randomSeed}` // Unique game ID
    }
    
    localStorage.setItem('lastGameResult', JSON.stringify(gameResult))
    
    // Update user's FLAMES progress
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userProgress = JSON.parse(localStorage.getItem('userFlamesProgress') || '{}')
    
    if (!userProgress[user.email]) {
      userProgress[user.email] = {
        playerName: user.name,
        email: user.email,
        completedResults: [],
        gamesPlayed: 0,
        startDate: Date.now(),
        photo: photo1 // Store user's photo from first game
      }
    }
    
    // Add this result if not already achieved
    if (!userProgress[user.email].completedResults.includes(result)) {
      userProgress[user.email].completedResults.push(result)
    }
    
    userProgress[user.email].gamesPlayed += 1
    userProgress[user.email].lastPlayed = Date.now()
    
    // If user completed all 6 FLAMES results, add to leaderboard
    if (userProgress[user.email].completedResults.length === 6) {
      const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]')
      
      // Check if user is already on leaderboard
      const existingIndex = leaderboard.findIndex((entry: any) => entry.email === user.email)
      
      const leaderboardEntry = {
        playerName: user.name,
        email: user.email,
        completedResults: userProgress[user.email].completedResults,
        gamesPlayed: userProgress[user.email].gamesPlayed,
        completionTime: Date.now() - userProgress[user.email].startDate,
        photo: userProgress[user.email].photo,
        timestamp: Date.now()
      }
      
      if (existingIndex >= 0) {
        leaderboard[existingIndex] = leaderboardEntry
      } else {
        leaderboard.push(leaderboardEntry)
      }
      
      // Sort by completion time (fastest first)
      leaderboard.sort((a: any, b: any) => a.completionTime - b.completionTime)
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)))
    }
    
    localStorage.setItem('userFlamesProgress', JSON.stringify(userProgress))
    
    router.push('/results')
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
            <Heart className="h-16 w-16 text-pink-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              FLAREUP Game
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter two names to discover your compatibility destiny!
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Names</CardTitle>
              <CardDescription>
                Type the names of two people to test their compatibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name1">First Name</Label>
                    <Input
                      id="name1"
                      placeholder="Enter first name"
                      value={name1}
                      onChange={(e) => setName1(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                      {photo1 ? (
                        <img src={photo1 || "/placeholder.svg"} alt="Person 1" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <Camera className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <Label htmlFor="photo1" className="cursor-pointer">
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <span>
                          <Upload className="h-4 w-4" />
                          Upload Photo
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="photo1"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e, 1)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name2">Second Name</Label>
                    <Input
                      id="name2"
                      placeholder="Enter second name"
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                      {photo2 ? (
                        <img src={photo2 || "/placeholder.svg"} alt="Person 2" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <Camera className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <Label htmlFor="photo2" className="cursor-pointer">
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <span>
                          <Upload className="h-4 w-4" />
                          Upload Photo
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="photo2"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e, 2)}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  💡 Upload photos for an even deeper analysis!
                </p>
                <Button
                  onClick={calculateFLAMES}
                  disabled={!name1.trim() || !name2.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-3"
                >
                  Calculate FLAREUP
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How FLAREUP Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { letter: 'F', word: 'Friends', color: 'bg-blue-500', description: 'Great friendship ahead!' },
                  { letter: 'L', word: 'Love', color: 'bg-red-500', description: 'True love connection!' },
                  { letter: 'A', word: 'Affection', color: 'bg-pink-500', description: 'Sweet affection!' },
                  { letter: 'M', word: 'Marriage', color: 'bg-purple-500', description: 'Perfect life partner!' },
                  { letter: 'E', word: 'Enemies', color: 'bg-orange-500', description: 'Better stay apart!' },
                  { letter: 'S', word: 'Single', color: 'bg-gray-500', description: 'Focus on yourself!' }
                ].map((item) => (
                  <div key={item.letter} className="text-center p-3 rounded-lg border">
                    <div className={`w-10 h-10 rounded-full ${item.color} text-white flex items-center justify-center text-lg font-bold mx-auto mb-2`}>
                      {item.letter}
                    </div>
                    <p className="font-medium text-sm">{item.word}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Audio Player */}
      <AudioPlayer />
    </div>
  )
}
