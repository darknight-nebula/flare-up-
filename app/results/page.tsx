'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, ArrowLeft, Trophy, RefreshCw, Flame, Sun, Moon, Calendar, Clock, Home, Baby, Briefcase, MapPin, Copy, Check } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useTheme } from "next-themes"
import { AudioPlayer } from "@/components/audio-player"

interface GameResult {
  name1: string
  name2: string
  result: string
  percentage: number
  detailedPercentages?: {
    Friends: number
    Love: number
    Affection: number
    Marriage: number
    Enemies: number
    Single: number
  }
  photo1?: string | null
  photo2?: string | null
  timestamp: number
  randomSeed?: number
  gameId?: string
}

export default function ResultsPage() {
  const [result, setResult] = useState<GameResult | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedResult = localStorage.getItem('lastGameResult')
    if (savedResult) {
      setResult(JSON.parse(savedResult))
    } else {
      router.push('/game')
    }
  }, [router])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!result) {
    return <div>Loading...</div>
  }

  const getResultColor = (result: string) => {
    const colors = {
      'Friends': 'from-blue-500 to-blue-600',
      'Love': 'from-red-500 to-red-600',
      'Affection': 'from-pink-500 to-pink-600',
      'Marriage': 'from-purple-500 to-purple-600',
      'Enemies': 'from-orange-500 to-orange-600',
      'Single': 'from-gray-500 to-gray-600'
    }
    return colors[result as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const getResultEmoji = (result: string) => {
    const emojis = {
      'Friends': '👫',
      'Love': '❤️',
      'Affection': '💕',
      'Marriage': '💍',
      'Enemies': '⚔️',
      'Single': '🙋‍♀️'
    }
    return emojis[result as keyof typeof emojis] || '🤔'
  }

  // Enhanced brutality messages with MORE variety
  const getMockingMessage = (result: string, name1: string, name2: string, percentage: number, gameId: string) => {
    // Use gameId to select different messages each time
    const messageIndex = parseInt(gameId.slice(-2), 16) % 5 // Use last 2 hex chars for selection
    
    const messages = {
      'Friends': [
        `💀 BRUTAL TRUTH: ${name1} and ${name2} are JUST friends! Someone's living in denial! 😅`,
        `${percentage}% friendship compatibility means ${name1} is permanently FRIEND-ZONED! RIP romantic dreams! ⚰️`,
        `${name2} sees ${name1} as their emotional support buddy - not dating material! Time to move on! 🚚`,
        `Congratulations ${name1}! You've won the "Best Supporting Character" award in ${name2}'s love story! 🎭`,
        `${name1}, you're like a brother/sister to ${name2}... and we all know how THAT ends! 🤢`
      ],
      'Love': [
        `🔥 ${name1} and ${name2} think they're in love! Cute, but wait until the honeymoon phase ends! 💔`,
        `${percentage}% love compatibility! Someone's about to learn what "irreconcilable differences" means! ⚖️`,
        `Love is in the air... along with future arguments about whose turn it is to do dishes! 🍽️💥`,
        `Aww, ${name1} and ${name2} are "in love"! Give it 3 months before someone's crying on TikTok! 📱😭`,
        `Love at ${percentage}%? That's cute! Wait until you see each other without makeup and filters! 💄📸`
      ],
      'Affection': [
        `😬 ${name1} and ${name2} have "affection" - aka the participation trophy of relationships! 🏆`,
        `${percentage}% affection! You're the human equivalent of room temperature water! 💧😐`,
        `Sweet affection detected! Translation: boring but harmless, like elevator music! 🎵💤`,
        `Affection? That's what you call it when you're too scared to say "friend zone"! 🤡`,
        `${name1} and ${name2} have the romantic intensity of a wet napkin! Thrilling! 🧻`
      ],
      'Marriage': [
        `💍 MARRIAGE?! ${name1} and ${name2} are ready to legally bind their dysfunction! Good luck! ⚖️💀`,
        `${percentage}% marriage compatibility! Hope you enjoy 50 years of passive-aggressive comments! 😤`,
        `Wedding bells are ringing... or is that the sound of your freedom dying? 🔔⚰️`,
        `Marriage material? Someone's about to learn why divorce lawyers exist! 👨‍💼💸`,
        `${name1} and ${name2} want to get married! The divorce attorneys are already celebrating! 🍾⚖️`
      ],
      'Enemies': [
        `⚔️ ENEMIES! Finally, some honesty! ${name1} and ${name2} bring out each other's worst! 👹`,
        `${percentage}% enemy compatibility! You two would argue about the weather! ⛈️🤬`,
        `Enemies detected! Even your WiFi would choose sides in this relationship! 📶💥`,
        `${name1} and ${name2} are enemies! At least you're honest about hating each other! 🤷‍♀️`,
        `Enemy level: ${percentage}%! You two make oil and water look compatible! 🛢️💧`
      ],
      'Single': [
        `🙋‍♀️ ${name1} is staying SINGLE! ${name2} would rather date their reflection! 🪞💔`,
        `${percentage}% single energy! Time to adopt 17 cats and call it a day! 🐱🐱🐱`,
        `Single forever! At least your Netflix account won't judge your life choices! 📺💸`,
        `${name1}, looks like you're destined for a lifetime of "it's complicated" status! 📱💔`,
        `Single at ${percentage}%! Even dating apps would swipe left on this combination! 📱👈`
      ]
    }
    
    const resultMessages = messages[result as keyof typeof messages] || ['The algorithm has spoken!']
    return resultMessages[messageIndex] || resultMessages[0]
  }

  // Enhanced detailed brutality with more variety - RANDOMIZED EVERY TIME
  const getDetailedBrutality = (result: string, name1: string, name2: string, percentage: number, gameId: string) => {
    // Use current timestamp + gameId for DIFFERENT results every time
    const currentTime = Date.now()
    const randomFactor = Math.random() * 1000
    const detailIndex = Math.floor((currentTime + randomFactor + parseInt(gameId.slice(-2), 16)) / 1000) % 3
    
    const detailedMessages = {
      'Friends': [
        [
          `• <strong>${name1}</strong>, you're basically ${name2}'s emotional support human. Congratulations! 🎉`,
          `• You'll be hearing about their dating adventures while you cry into your pillow at night 😭`,
          `• ${name2} sees you the same way they see their sibling - ZERO romantic potential! 🚫`,
          `• You're the person they call when they need help moving furniture, not when they need a date 📦`,
          `• Time to accept reality: You're the "safe option" they'll never choose 💸`,
          `• Your ${percentage}% friendship score means you're stuck in the friend zone PERMANENTLY! 🔒`
        ],
        [
          `• ${name1}, you've been promoted to "Best Friend" - the kiss of death for romance! 💋💀`,
          `• ${name2} probably introduces you as "like a brother/sister to me" - OUCH! 🤕`,
          `• You're the shoulder they cry on about their ACTUAL crushes! How romantic! 😢`,
          `• ${percentage}% friendship means you'll be their wedding guest, not their spouse! 💒👥`,
          `• You're living in the friend zone rent-free, but the emotional cost is BRUTAL! 💸😭`,
          `• Time to update your dating profile: "Professional friend-zone resident since forever" 📱`
        ],
        [
          `• Congratulations ${name1}! You've achieved "Platonic Soulmate" status - aka romantic death! ⚰️`,
          `• ${name2} values your friendship too much to "ruin it" with romance (translation: you're not attractive enough) 💔`,
          `• You're the person they text at 2 AM about their relationship problems with OTHER people! 📱🌙`,
          `• ${percentage}% friendship compatibility = 0% romantic potential! Math doesn't lie! 🧮`,
          `• You're basically their unpaid therapist who they'll never kiss! Professional boundaries! 👨‍⚕️`,
          `• Welcome to the friend zone hall of fame - population: YOU! 🏛️`
        ]
      ],
      'Love': [
        [
          `• Oh look, ${name1} and ${name2} think they're in a fairy tale! How adorable! 🧚‍♀️`,
          `• ${percentage}% love compatibility? That's cute, but wait until reality hits! 💥`,
          `• You'll probably break up over something stupid like leaving dishes in the sink 🍽️`,
          `• One of you is definitely more invested than the other - guess who's getting their heart broken? 💔`,
          `• "Love" at this stage just means you tolerate each other's bad breath in the morning 🤢`,
          `• Give it 6 months before one of you is crying to your friends about "what went wrong" 😢`
        ],
        [
          `• ${name1} and ${name2} are "in love" - translation: hormones are temporarily clouding judgment! 🧠☁️`,
          `• ${percentage}% love means you'll fight about everything from toothpaste tubes to Netflix choices! 🦷📺`,
          `• You're in the honeymoon phase where even their annoying habits seem "cute" - spoiler: they're not! 🍯`,
          `• Love is blind, but your friends can see this trainwreck coming from miles away! 🚂💥`,
          `• You'll go from "I love everything about you" to "you breathe too loudly" real quick! 👂`,
          `• Enjoy the butterflies while they last - soon they'll be replaced by eye rolls! 🦋🙄`
        ],
        [
          `• ${name1} and ${name2} think they've found "the one" - statistically, you haven't! 📊`,
          `• Love at ${percentage}%? Wait until you live together and discover their REAL habits! 🏠😱`,
          `• You're currently in the "everything is perfect" phase - reality check incoming! ✈️💥`,
          `• This "love" will survive exactly until the first major disagreement about money! 💰⚔️`,
          `• You'll be posting couple photos while secretly planning your escape route! 📸🚪`,
          `• Love is temporary, but the therapy bills from this relationship will be permanent! 💊💸`
        ]
      ],
      'Affection': [
        [
          `• Congratulations! You've achieved the relationship equivalent of a participation award! 🎖️`,
          `• ${percentage}% affection means you're "nice" but not "wow, I need you in my life" 😐`,
          `• You're the human equivalent of lukewarm coffee - not terrible, but not exciting either ☕`,
          `• ${name2} probably describes you as "sweet" to their friends (translation: BORING) 😴`,
          `• You send good morning texts that get left on read for 3 hours 📱`,
          `• This is the relationship that ends with "it's not you, it's me" (spoiler: it's definitely you) 🤥`
        ],
        [
          `• ${name1} and ${name2} have "affection" - the vanilla ice cream of relationships! 🍦`,
          `• ${percentage}% affection means you're safe, predictable, and utterly forgettable! 😴`,
          `• You're the relationship equivalent of beige wallpaper - technically fine, but who cares? 🏠`,
          `• This "affection" has all the passion of a corporate team-building exercise! 👔`,
          `• You'll be the couple that other couples forget to invite to parties! 🎉❌`,
          `• Congratulations on achieving maximum mediocrity in romance! 🏆😐`
        ],
        [
          `• Affection at ${percentage}%? You're the relationship equivalent of elevator music! 🎵😴`,
          `• ${name1} and ${name2} have the romantic spark of a wet matchstick! 🔥💧`,
          `• This relationship has all the excitement of watching paint dry in slow motion! 🎨⏰`,
          `• You're the couple that makes other people appreciate being single! 🙋‍♀️`,
          `• Your idea of a wild night is probably choosing a different Netflix show! 📺`,
          `• This "affection" will put everyone around you to sleep - including yourselves! 😴`
        ]
      ],
      'Marriage': [
        [
          `• ${percentage}% marriage compatibility? Someone's living in a fantasy world! 🏰`,
          `• You're probably the couple that fights over the thermostat for 50 years 🌡️`,
          `• ${name1}, hope you enjoy hearing ${name2} chew for the rest of your life! 🍎`,
          `• Your kids will definitely need therapy to deal with your "perfect" relationship 👶💊`,
          `• You'll be that couple posting fake happy photos while secretly planning your escape 📸`,
          `• Marriage means legally binding yourself to someone who steals your fries! 🍟⚖️`
        ],
        [
          `• Marriage? ${name1} and ${name2} want to make their dysfunction LEGAL! 📜⚖️`,
          `• ${percentage}% marriage compatibility = 100% chance of passive-aggressive dinner conversations! 🍽️😤`,
          `• You'll go from "I do" to "I don't want to anymore" faster than you can say "prenup"! 💍💔`,
          `• Marriage is just a fancy way of saying "I want to argue with you forever"! ⚔️♾️`,
          `• You'll be the couple that makes divorce lawyers rich! 👨‍💼💰`,
          `• Till death do us part? More like till Netflix passwords get changed! 📺🔐`
        ],
        [
          `• ${name1} and ${name2} think marriage will fix their problems - spoiler alert: it won't! 🔧❌`,
          `• ${percentage}% marriage material? The divorce rate would like a word! 📊⚖️`,
          `• You'll spend more on couples therapy than your actual wedding! 💒💸`,
          `• Marriage: because nothing says "love" like legally binding contracts! 📋💕`,
          `• You'll be arguing about whose turn it is to take out the trash for DECADES! 🗑️⏰`,
          `• Congratulations on choosing the most expensive way to be miserable together! 💰😢`
        ]
      ],
      'Enemies': [
        [
          `• ${percentage}% enemy compatibility - now THIS is accurate! 🎯`,
          `• You two would argue about the color of the sky if given the chance ☁️`,
          `• ${name1} and ${name2} bring out the absolute WORST in each other! 👹`,
          `• Your conversations are basically verbal warfare disguised as "discussions" 💣`,
          `• You're the couple that makes everyone else uncomfortable at parties 🎉😬`,
          `• Even your pets would choose sides in your breakup! 🐕🐈`,
          `• At least you're honest about hating each other - that's refreshing! 🤷‍♀️`
        ],
        [
          `• Enemies at ${percentage}%! You two are like oil and water, but WORSE! 🛢️💧`,
          `• ${name1} and ${name2} could start a fight in an empty room! 🏠⚔️`,
          `• You're the couple that argues about which way the toilet paper should hang! 🧻😤`,
          `• Your relationship has more red flags than a communist parade! 🚩🚩🚩`,
          `• You bring out each other's inner demons - and they're UGLY! 👹`,
          `• Even Switzerland would refuse to mediate your conflicts! 🇨🇭❌`,
          `• You're proof that opposites don't attract - they REPEL! 🧲❌`
        ],
        [
          `• ${percentage}% enemy compatibility! You two are a walking disaster movie! 🎬💥`,
          `• ${name1} and ${name2} have the chemistry of bleach and ammonia - TOXIC! ☠️`,
          `• You're the couple that would argue during a zombie apocalypse! 🧟‍♂️⚔️`,
          `• Your fights are so legendary, they should be pay-per-view events! 📺💰`,
          `• You bring out each other's worst qualities like a toxic talent show! 🎭☠️`,
          `• Even your horoscopes are probably incompatible! ⭐❌`,
          `• You're living proof that some people should come with warning labels! ⚠️`
        ]
      ],
      'Single': [
        [
          `• ${percentage}% single energy - the universe is telling you to give up! 🌌`,
          `• ${name1}, ${name2} would rather date a cactus than you! 🌵`,
          `• You're destined to be the third wheel at every social gathering 🚲`,
          `• Your dating profile will collect dust like an abandoned museum exhibit 🏛️`,
          `• Time to invest in cats - they're your only hope for companionship! 🐱`,
          `• You'll be telling people "I'm focusing on myself" for the next 20 years 📚`,
          `• At least pizza will never disappoint you like humans do! 🍕❤️`
        ],
        [
          `• Single at ${percentage}%! ${name1}, even dating apps would reject this match! 📱❌`,
          `• ${name2} would rather be alone forever than settle for ${name1}! 🏝️`,
          `• You're the person who makes others grateful for their toxic relationships! 💔`,
          `• Your love life has less activity than a cemetery at midnight! ⚰️🌙`,
          `• Time to embrace the single life - it's not like you have a choice! 🤷‍♀️`,
          `• You'll be the person who brings a book to weddings instead of a plus-one! 📖💒`,
          `• Congratulations on achieving maximum romantic repulsion! 🏆❌`
        ],
        [
          `• ${percentage}% single forever! ${name1}, time to adopt the crazy cat person lifestyle! 🐱👤`,
          `• ${name2} sees ${name1} as romantically appealing as expired milk! 🥛🤢`,
          `• You're the reason dating apps have a "block" feature! 📱🚫`,
          `• Your romantic prospects are dimmer than a broken flashlight! 🔦💔`,
          `• Time to invest in a good therapist and several houseplants! 🌱👨‍⚕️`,
          `• You'll be the person who talks to their Alexa for emotional support! 🗣️🤖`,
          `• Single life chose YOU - and it's not letting go! 🤝🔒`
        ]
      ]
    }
    
    const resultMessages = detailedMessages[result as keyof typeof detailedMessages] || [[]]
    return resultMessages[detailIndex] || resultMessages[0]
  }

  // 10 Years Later predictions based on compatibility result
  const getTenYearsPrediction = (result: string, name1: string, name2: string, percentage: number, gameId: string) => {
    const predictionIndex = parseInt(gameId.slice(-3, -1), 16) % 3 // Different selection for variety

    const predictions = {
      'Friends': [
        {
          title: "The Professional Best Friend 👫",
          lifestyle: `${name1} has turned being ${name2}'s best friend into a full-time career! They literally get paid to be the emotional support human. ${name2} has them on speed dial for every minor inconvenience, from choosing breakfast cereals to existential crises at 3 AM.`,
          living: `${name1} lives in an apartment with a shrine dedicated to their friendship with ${name2}. The walls are covered with friendship bracelets, matching t-shirts, and a vision board titled "Maybe Someday." ${name2} lives blissfully unaware in a house with their actual romantic partner.`,
          career: `${name1} became a professional wingman/wingwoman and wrote a bestselling book: "Friend Zone: Population Me." ${name2} works as a relationship counselor, giving advice they never follow themselves.`,
          social: `${name1} is invited to every family gathering as "the friend who's basically family." They know ${name2}'s relatives better than ${name2} does. The family dog likes ${name1} more than ${name2}.`,
          prediction: `${name1} will eventually start a support group for people stuck in the friend zone. ${name2} will join thinking it's a regular book club! 📚😅`
        },
        {
          title: "The Backup Plan Champion 🏆",
          lifestyle: `${name1} has mastered the art of being everyone's backup plan! They're not just ${name2}'s backup - they're the backup for 47 other people. They have a color-coded calendar tracking everyone's relationship status.`,
          living: `${name1} lives in a studio apartment with a Murphy bed and emergency snacks for when people need emotional support. ${name2} lives in a mansion they inherited from their third ex-partner (${name1} helped them move out each time).`,
          career: `${name1} works as a professional organizer, specializing in helping people organize their lives while their own remains chaotic. ${name2} became a wedding planner, and ${name1} is their unpaid assistant.`,
          social: `${name1} knows everyone's secrets and could write a tell-all book but won't because they're "too nice." They're the group therapist who never gets therapy themselves.`,
          prediction: `${name1} will accidentally become famous on TikTok for their "Backup Plan Life Hacks" and finally get the recognition they deserve! 📱✨`
        },
        {
          title: "The Friendship Influencer 📸",
          lifestyle: `${name1} and ${name2} became friendship influencers with 2 million followers who think they're "friendship goals." Plot twist: ${name1} is still secretly in love and ${name2} still has no clue!`,
          living: `They live in a content house designed for maximum friendship content creation. Every room is Instagram-ready, and they have a professional photographer following them around documenting their "authentic" friendship.`,
          career: `They make millions from sponsored friendship content, selling everything from matching pajamas to "Best Friend Forever" vitamins. ${name1} handles the business side while crying into their pillow at night.`,
          social: `They host friendship workshops and have a podcast called "Just Friends" where ${name1} drops hints that go completely over ${name2}'s head. Their audience ships them harder than ${name1} does.`,
          prediction: `The truth will come out during a live stream when ${name1} accidentally confesses their feelings to 2 million viewers! The internet will never recover! 📺💥`
        }
      ],
      'Love': [
        {
          title: "The Chaos Couple 🌪️",
          lifestyle: `${name1} and ${name2} are still together, but their "love" now resembles a reality TV show that got cancelled for being too dramatic. They break up every Tuesday and get back together every Friday like clockwork.`,
          living: `They live in a house with two separate entrances because they're "taking space" but refuse to actually separate. The neighbors have learned to ignore the dramatic music that plays every time one of them leaves.`,
          career: `${name1} works as a drama teacher (perfect training), while ${name2} became a meteorologist because they're used to predicting storms. Their relationship has its own weather system.`,
          social: `Their friends have a betting pool on how long each breakup will last. The record is 3 hours and 47 minutes. They're banned from group chats during "dramatic phases."`,
          prediction: `They'll either get their own reality show called "Love is a Battlefield" or accidentally solve world peace through their chaotic energy! 🌍✌️`
        },
        {
          title: "The Competitive Lovers 🏁",
          lifestyle: `${name1} and ${name2} turned their relationship into a competition! They compete over everything: who loves more, who remembers anniversaries better, who can cry more dramatically during movies.`,
          living: `Their house is divided into "his" and "hers" sections with scoreboards tracking relationship points. They have separate Netflix accounts and compete for who can binge-watch more romantic comedies.`,
          career: `${name1} became a game show host, ${name2} works in competitive sports commentary. They bring their work home and narrate their own relationship like it's the Olympics.`,
          social: `Their friends are exhausted from being judges in their relationship competitions. They've been asked to rate everything from surprise dates to who gives better hugs.`,
          prediction: `They'll win a couples game show and use the prize money to build separate wings of their house. Love finds a way! 🏠💕`
        },
        {
          title: "The Love Scientists 🧪",
          lifestyle: `${name1} and ${name2} decided to scientifically optimize their relationship! They track everything: heart rates during conversations, optimal hug duration, and the perfect ratio of compliments to constructive criticism.`,
          living: `Their home looks like a laboratory with charts, graphs, and a relationship data center. They have scheduled "spontaneous" romantic moments and color-coded calendars for emotions.`,
          career: `${name1} became a relationship researcher, ${name2} works in data analysis. They publish papers on their own relationship and give TED talks about "Love Through Statistics."`,
          social: `Their friends are test subjects in their relationship experiments. Dinner parties include surveys and exit interviews about the evening's romantic atmosphere.`,
          prediction: `They'll accidentally discover the formula for perfect love and become billionaires selling relationship algorithms! Science wins! 🔬💰`
        }
      ],
      'Affection': [
        {
          title: "The Beige Dynasty 🏠",
          lifestyle: `${name1} and ${name2} have achieved peak beige! Their life is so perfectly average that they've become accidentally famous for being the most normal couple on Earth. Museums study their lifestyle.`,
          living: `They live in a house that's featured in "Boring Homes & Gardens" magazine. Every room is painted in different shades of beige, and they have a collection of decorative spoons from gas stations.`,
          career: `${name1} works in customer service and has never received a complaint or compliment. ${name2} works in quality control for paint companies, specializing in neutral colors.`,
          social: `They're the couple everyone calls when they need to fall asleep. Their dinner parties are so relaxing that guests often take naps on the couch. It's actually therapeutic.`,
          prediction: `They'll accidentally become meditation gurus when people realize their presence induces instant zen! Boring is the new enlightenment! 🧘‍♀️✨`
        },
        {
          title: "The Comfort Zone Champions 🛋️",
          lifestyle: `${name1} and ${name2} have turned comfort into an art form! They haven't left their neighborhood in 5 years and know every delivery driver by name. Adventure is ordering from a new restaurant.`,
          living: `Their house is a fortress of comfort with 47 throw pillows, 12 blankets, and a refrigerator that orders groceries automatically. They have a room dedicated entirely to different types of slippers.`,
          career: `${name1} works from home testing mattresses, ${name2} reviews comfort food for a living. They're professional cozy people and have never been more content.`,
          social: `Their friends come over to experience true relaxation. They host "Comfort Parties" where everyone wears pajamas and the most exciting activity is comparing different brands of hot chocolate.`,
          prediction: `They'll open a "Comfort Resort" where stressed people come to experience their legendary chill vibes! Relaxation empire incoming! 🏨😴`
        },
        {
          title: "The Wholesome Content Creators 📹",
          lifestyle: `${name1} and ${name2} accidentally became viral for being the most wholesome couple on the internet! Their content is so pure that it's used as therapy for people who've lost faith in humanity.`,
          living: `They live in a cottage that looks like it belongs in a fairy tale, complete with a garden where they grow vegetables and talk to butterflies. Their home is a designated "Negativity-Free Zone."`,
          career: `${name1} makes educational videos about kindness, ${name2} runs a channel about sustainable living. Together they're saving the world one wholesome video at a time.`,
          social: `Their friends feel like better people just by being around them. They host community garden parties and their biggest scandal was using store-bought cookies instead of homemade ones.`,
          prediction: `They'll accidentally solve social media toxicity by being so genuinely nice that trolls reform and become gardeners! World peace through wholesomeness! 🌍🌻`
        }
      ],
      'Marriage': [
        {
          title: "The Over-Planners United 📋",
          lifestyle: `${name1} and ${name2} have planned their entire lives down to the minute! They have spreadsheets for everything: optimal breakfast timing, scheduled spontaneous moments, and a 50-year plan for their lawn care.`,
          living: `Their house runs like a Swiss watch with color-coded schedules on every wall. They have backup plans for their backup plans and a emergency protocol for when the Wi-Fi goes down.`,
          career: `${name1} became a professional organizer for NASA, ${name2} works in disaster preparedness. Together they could organize the apocalypse and make it run on time.`,
          social: `Their friends rely on them to plan everything because they're terrifyingly efficient. They once planned a surprise party so well that they surprised themselves.`,
          prediction: `They'll be hired by the government to organize world peace negotiations and accidentally succeed because everyone's too impressed by their spreadsheets to fight! 📊🕊️`
        },
        {
          title: "The Competitive Married Couple 🏆",
          lifestyle: `${name1} and ${name2} turned marriage into a sport! They compete over who's the better spouse with scoreboards, trophies, and monthly performance reviews. Love is a contact sport in their house.`,
          living: `Their house has separate trophy rooms for "Best Husband/Wife" awards they give each other. They have a marriage referee (their neighbor) who settles disputes about who did more chores.`,
          career: `${name1} works in competitive analysis, ${name2} became a sports commentator. They provide live commentary on their own marriage and sell tickets to their anniversary celebrations.`,
          social: `Their friends are exhausted from judging their marriage competitions but can't look away. They've turned date night into a game show that their neighbors watch from their windows.`,
          prediction: `They'll win the "World's Most Competitive Couple" award and use their acceptance speech to challenge other couples to a marriage-off! Game on! 🎮💍`
        },
        {
          title: "The Accidental Empire Builders 🏰",
          lifestyle: `${name1} and ${name2} accidentally built a business empire by being really good at marriage! They started giving advice as a joke and now they're millionaire marriage gurus with no idea how it happened.`,
          living: `They live in a mansion they bought with "marriage advice money" and still can't believe it's real. Every room has motivational marriage quotes they made up while grocery shopping.`,
          career: `${name1} writes bestselling books about marriage (first book was titled "We Have No Idea What We're Doing"), ${name2} hosts a talk show where they give advice while clearly making it up.`,
          social: `Their friends are amazed that the couple who used to argue about pizza toppings now gives relationship seminars to thousands of people. They're frauds, but successful frauds!`,
          prediction: `They'll accidentally become the most famous marriage experts in history and finally admit they've been winging it the whole time! Honesty is the best policy! 📚🎤`
        }
      ],
      'Enemies': [
        {
          title: "The Professional Arguers ⚔️",
          lifestyle: `${name1} and ${name2} discovered they're so good at arguing that they turned it into a career! They're now professional debate coaches who can argue about anything and somehow still live together.`,
          living: `Their house has a designated "Argument Arena" with scoreboards and a referee whistle. They've soundproofed the walls not for privacy, but so they can argue at full volume without disturbing neighbors.`,
          career: `${name1} works as a lawyer specializing in ridiculous cases, ${name2} became a debate team coach. They practice on each other and their success rate is 100% because they never agree on anything.`,
          social: `Their friends hire them to settle disputes because they're experts at finding flaws in any argument. They once argued for 6 hours about whether water is wet and both won somehow.`,
          prediction: `They'll become the world's first "Argument Consultants" and help the UN solve international conflicts through the power of productive disagreement! 🌍⚖️`
        },
        {
          title: "The Chaos Coordinators 🌪️",
          lifestyle: `${name1} and ${name2} realized their chaotic energy is actually a superpower! They now work as professional chaos coordinators, helping boring people add excitement to their lives.`,
          living: `Their house changes layout weekly because they can't agree on furniture placement. The neighbors use their arguments as a natural alarm clock and entertainment system.`,
          career: `${name1} works as a stunt coordinator for soap operas, ${name2} plans "disaster parties" for people who want drama in their lives. They're booked solid because everyone wants their chaos energy.`,
          social: `Their friends' lives became infinitely more interesting after meeting them. They accidentally started 12 new relationships and ended 8 others just by existing in their friend group.`,
          prediction: `They'll open a "Chaos Consulting" business and accidentally solve world boredom! Sometimes the world needs a little more drama! 🎭✨`
        },
        {
          title: "The Unlikely Peace Ambassadors 🕊️",
          lifestyle: `Plot twist: ${name1} and ${name2} discovered that their constant fighting taught them how to resolve ANY conflict! They're now international peace negotiators who argue their way to world harmony.`,
          living: `Their house is now a neutral zone where world leaders come to settle disputes. They have a "Conflict Resolution Garden" where they grow vegetables while mediating international incidents.`,
          career: `${name1} works for the United Nations as a "Professional Disagreer," ${name2} specializes in "Constructive Conflict Creation." They're the most successful peace team in history.`,
          social: `Their friends are amazed that the couple who used to fight about everything now helps countries avoid wars. They still argue, but now it's for the greater good!`,
          prediction: `They'll win the Nobel Peace Prize for "Most Creative Use of Arguing for World Peace" and give the most chaotic acceptance speech in history! 🏆🌍`
        }
      ],
      'Single': [
        {
          title: "The Professional Single Person 🙋‍♀️",
          lifestyle: `${name1} has turned being single into a full-time career! They're now a "Single Life Consultant" helping people optimize their solo existence. ${name2} moved to Antarctica to study penguins and avoid all human relationships.`,
          living: `${name1} lives in a perfectly organized apartment designed for one person, with a guest room that's never been used. ${name2} lives in an igloo with 200 penguins who are better company than humans.`,
          career: `${name1} wrote 47 bestselling books about single life and has a TV show called "Party of One." ${name2} became a penguin researcher and gives TED talks about why penguins are superior to humans.`,
          social: `${name1} hosts "Single and Fabulous" parties where everyone celebrates not having to share their food. ${name2} sends postcards from Antarctica with penguin facts instead of relationship updates.`,
          prediction: `${name1} will become the world's first "Single Life Billionaire" and ${name2} will be elected mayor of Antarctica by the penguins! Success comes in many forms! 🐧👑`
        },
        {
          title: "The Accidental Hermits 🏔️",
          lifestyle: `${name1} and ${name2} independently decided that humans are overrated and both became hermits! They live on opposite sides of the same mountain and communicate only through smoke signals about the weather.`,
          living: `${name1} lives in a cabin with 47 houseplants they talk to daily. ${name2} lives in a cave with a family of bears who adopted them. Both are surprisingly happy with their life choices.`,
          career: `${name1} makes artisanal candles and sells them online without human interaction. ${name2} became a wilderness survival expert and writes books about living with bears (the bears help with editing).`,
          social: `${name1}'s social life consists of naming their plants and having deep conversations with them. ${name2}'s bear family is more supportive than any human relationship they ever had.`,
          prediction: `They'll accidentally meet at the mountain peak in 20 years, realize they're perfect for each other, and immediately move to opposite ends of the Earth again! 🏔️😂`
        },
        {
          title: "The Single Success Stories 🌟",
          lifestyle: `${name1} discovered that being single is actually their superpower! They became a motivational speaker about self-love. ${name2} started a cult worshipping themselves and has 10,000 followers.`,
          living: `${name1} lives in a mansion they bought with "Self-Love Seminar" money, complete with a shrine to their own awesomeness. ${name2} lives in a compound where everyone celebrates their birthday monthly.`,
          career: `${name1} makes millions teaching people to love themselves first. ${name2} became a professional "Me Time" consultant and charges $500/hour to teach people how to enjoy their own company.`,
          social: `${name1} has thousands of friends who all want to learn their secret to happiness. ${name2}'s cult members fight over who gets to spend time with them (they schedule it democratically).`,
          prediction: `${name1} will write the definitive guide to single life and ${name2} will accidentally start a new religion based on self-worship! Both will be happier than any couple ever! 📚⛪`
        }
      ]
    }

    const resultPredictions = predictions[result as keyof typeof predictions] || predictions['Single']
    return resultPredictions[predictionIndex] || resultPredictions[0]
  }

  const shareResult = async () => {
    const shareText = `🔥 FLAREUP Result: ${result.name1} & ${result.name2} are ${result.result} with ${result.percentage}% compatibility! ${getResultEmoji(result.result)}\n\nTry FLAREUP at ${window.location.origin}`
    
    try {
      // Try Web Share API first
      if (navigator.share && navigator.canShare && navigator.canShare({ text: shareText })) {
        await navigator.share({
          title: 'FLAREUP Game Result',
          text: shareText,
          url: window.location.origin
        })
        return
      }
      
      // Fallback to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return
      }
      
      // Final fallback - create a temporary textarea
      const textArea = document.createElement('textarea')
      textArea.value = shareText
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy text: ', err)
        // Show the text in an alert as last resort
        alert(`Copy this result:\n\n${shareText}`)
      } finally {
        document.body.removeChild(textArea)
      }
    } catch (err) {
      console.error('Error sharing:', err)
      // Show the text in an alert as last resort
      alert(`Copy this result:\n\n${shareText}`)
    }
  }

  const flamesData = [
    { letter: 'F', word: 'Friends', color: 'bg-blue-500', textColor: 'text-blue-600' },
    { letter: 'L', word: 'Love', color: 'bg-red-500', textColor: 'text-red-600' },
    { letter: 'A', word: 'Affection', color: 'bg-pink-500', textColor: 'text-pink-600' },
    { letter: 'M', word: 'Marriage', color: 'bg-purple-500', textColor: 'text-purple-600' },
    { letter: 'E', word: 'Enemies', color: 'bg-orange-500', textColor: 'text-orange-600' },
    { letter: 'S', word: 'Single', color: 'bg-gray-500', textColor: 'text-gray-600' }
  ]

  const tenYearsPrediction = getTenYearsPrediction(result.result, result.name1, result.name2, result.percentage, result.gameId || '0')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20">
      <header className="p-4 flex justify-between items-center">
        <Link href="/game">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Play Again
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          <Link href="/leaderboard">
            <Button variant="outline" className="gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">{getResultEmoji(result.result)}</div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Your FLAREUP Result
            </h1>
          </div>

          <Card className="mb-8 overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${getResultColor(result.result)}`}></div>
            <CardHeader className="text-center">
              <div className="flex justify-center items-center gap-8 mb-6">
                {result.photo1 && (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img src={result.photo1 || "/placeholder.svg"} alt={result.name1} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-lg font-medium">{result.name1}</p>
                  {!result.photo1 && <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                    {result.name1.charAt(0).toUpperCase()}
                  </div>}
                </div>
                
                <Heart className="h-8 w-8 text-pink-500 animate-pulse" />
                
                <div className="text-center">
                  <p className="text-lg font-medium">{result.name2}</p>
                  {!result.photo2 && <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                    {result.name2.charAt(0).toUpperCase()}
                  </div>}
                </div>
                {result.photo2 && (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img src={result.photo2 || "/placeholder.svg"} alt={result.name2} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className={`inline-block px-8 py-4 rounded-full bg-gradient-to-r ${getResultColor(result.result)} text-white mb-4 animate-pulse`}>
                  <div className="text-3xl font-bold">{result.percentage}%</div>
                  <div className="text-lg">{result.result}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border-l-4 border-yellow-500 mb-6">
                <p className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
                  {getMockingMessage(result.result, result.name1, result.name2, result.percentage, result.gameId || '0')}
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={shareResult}
                  className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Share Result'}
                </Button>
                <Link href="/game">
                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="brutality" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="brutality">Brutal Reality 💀</TabsTrigger>
              <TabsTrigger value="analysis">FLAREUP Analysis 🔥</TabsTrigger>
              <TabsTrigger value="future" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                10 Years Later
              </TabsTrigger>
              <TabsTrigger value="meaning">What It Means 📖</TabsTrigger>
            </TabsList>

            <TabsContent value="brutality" className="mt-6">
              <Card className="border-2 border-red-200 dark:border-red-800">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <Flame className="h-5 w-5" />
                    Brutal Reality Check 💀
                  </CardTitle>
                  <CardDescription className="text-red-600 dark:text-red-300">
                    Time for some harsh truths about your relationship...
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {result.result === 'Friends' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">FRIEND-ZONED FOREVER! 👫💔</h4>
                        <div className="space-y-2 text-blue-700 dark:text-blue-200">
                          {getDetailedBrutality(result.result, result.name1, result.name2, result.percentage, result.gameId || '0').map((message, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: message }} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {result.result === 'Love' && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                        <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">LOVE? SERIOUSLY? 😂❤️</h4>
                        <div className="space-y-2 text-red-700 dark:text-red-200">
                          {getDetailedBrutality(result.result, result.name1, result.name2, result.percentage, result.gameId || '0').map((message, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: message }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {result.result === 'Affection' && (
                      <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border-l-4 border-pink-500">
                        <h4 className="font-bold text-pink-800 dark:text-pink-300 mb-2">AFFECTION = PARTICIPATION TROPHY! 🏆💕</h4>
                        <div className="space-y-2 text-pink-700 dark:text-pink-200">
                          {getDetailedBrutality(result.result, result.name1, result.name2, result.percentage, result.gameId || '0').map((message, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: message }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {result.result === 'Marriage' && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">MARRIAGE MATERIAL? BOLD ASSUMPTION! 💍💀</h4>
                        <div className="space-y-2 text-purple-700 dark:text-purple-200">
                          {getDetailedBrutality(result.result, result.name1, result.name2, result.percentage, result.gameId || '0').map((message, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: message }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {result.result === 'Enemies' && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border-l-4 border-orange-500">
                        <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2">ENEMIES! FINALLY, SOME HONESTY! ⚔️🔥</h4>
                        <div className="space-y-2 text-orange-700 dark:text-orange-200">
                          {getDetailedBrutality(result.result, result.name1, result.name2, result.percentage, result.gameId || '0').map((message, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: message }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {result.result === 'Single' && (
                      <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border-l-4 border-gray-500">
                        <h4 className="font-bold text-gray-800 dark:text-gray-300 mb-2">SINGLE FOREVER! EMBRACE THE LONELINESS! 🙋‍♀️💀</h4>
                        <div className="space-y-2 text-gray-700 dark:text-gray-200">
                          {getDetailedBrutality(result.result, result.name1, result.name2, result.percentage, result.gameId || '0').map((message, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: message }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-red-100 dark:from-yellow-900/20 dark:to-red-900/20 rounded-lg border border-yellow-300 dark:border-yellow-600">
                    <p className="text-center font-bold text-yellow-800 dark:text-yellow-200">
                      💀 REMEMBER: The algorithm doesn't lie, but your feelings might! 💀
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Detailed FLAREUP Analysis
                  </CardTitle>
                  <CardDescription>
                    Here's how each relationship type scored for {result.name1} & {result.name2}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flamesData.map((item, index) => {
                      const percentage = result.detailedPercentages?.[item.word as keyof typeof result.detailedPercentages] || 0
                      const isHighest = percentage === result.percentage
                      
                      return (
                        <div key={item.letter} className={`p-4 rounded-lg border-2 transition-all ${
                          isHighest 
                            ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg transform scale-105' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${item.color} text-white flex items-center justify-center text-lg font-bold ${
                                isHighest ? 'animate-pulse' : ''
                              }`}>
                                {item.letter}
                              </div>
                              <div>
                                <p className={`font-semibold ${item.textColor} ${isHighest ? 'text-lg' : ''}`}>
                                  {item.word}
                                  {isHighest && <span className="ml-2 text-yellow-500">👑 WINNER!</span>}
                                </p>
                              </div>
                            </div>
                            <div className={`text-right ${isHighest ? 'text-xl font-bold text-yellow-600 dark:text-yellow-400' : 'text-lg font-medium'}`}>
                              {percentage}%
                            </div>
                          </div>
                          <Progress 
                            value={percentage} 
                            className={`h-3 ${isHighest ? 'h-4' : ''}`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="future" className="mt-6">
              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                    <Calendar className="h-5 w-5" />
                    {tenYearsPrediction.title}
                  </CardTitle>
                  <CardDescription className="text-purple-600 dark:text-purple-300">
                    A glimpse into {result.name1} & {result.name2}'s future based on their {result.percentage}% {result.result} compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Lifestyle & Relationship Status
                      </h4>
                      <p className="text-blue-700 dark:text-blue-200">{tenYearsPrediction.lifestyle}</p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Living Situation
                      </h4>
                      <p className="text-green-700 dark:text-green-200">{tenYearsPrediction.living}</p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg border-l-4 border-orange-500">
                      <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Career & Finances
                      </h4>
                      <p className="text-orange-700 dark:text-orange-200">{tenYearsPrediction.career}</p>
                    </div>

                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-lg border-l-4 border-pink-500">
                      <h4 className="font-bold text-pink-800 dark:text-pink-300 mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Social Life & Friendships
                      </h4>
                      <p className="text-pink-700 dark:text-pink-200">{tenYearsPrediction.social}</p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                      <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        The Final Prediction
                      </h4>
                      <p className="text-purple-700 dark:text-purple-200 font-medium">{tenYearsPrediction.prediction}</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-300 dark:border-indigo-600">
                    <p className="text-center font-bold text-indigo-800 dark:text-indigo-200">
                      🔮 Remember: The future is written in the stars... and brutal algorithms! 🔮
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meaning" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>What does {result.result} mean?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.result === 'Friends' && (
                      <div>
                        <h4 className="font-semibold text-blue-600 dark:text-blue-400">Friends 👫</h4>
                        <p className="text-muted-foreground">You two have a wonderful friendship connection! This relationship is built on trust, understanding, and mutual respect. Great friends are hard to find, and you've got something special. But hey, someone's definitely in the friend zone here! 😅</p>
                      </div>
                    )}
                    {result.result === 'Love' && (
                      <div>
                        <h4 className="font-semibold text-red-600 dark:text-red-400">Love ❤️</h4>
                        <p className="text-muted-foreground">True love has found its way to you! This deep romantic connection suggests passion, understanding, and a beautiful emotional bond. Love like this is rare and precious. Time to change that relationship status! 💕</p>
                      </div>
                    )}
                    {result.result === 'Affection' && (
                      <div>
                        <h4 className="font-semibold text-pink-600 dark:text-pink-400">Affection 💕</h4>
                        <p className="text-muted-foreground">Sweet affection flows between you two! This represents genuine care, tenderness, and warmth. It's a beautiful foundation for any relationship. You're probably the type to send good morning texts! 🥰</p>
                      </div>
                    )}
                    {result.result === 'Marriage' && (
                      <div>
                        <h4 className="font-semibold text-purple-600 dark:text-purple-400">Marriage 💍</h4>
                        <p className="text-muted-foreground">Wedding bells are in your future! This suggests you're perfect life partners with incredible compatibility. You complement each other beautifully. Someone better start ring shopping! 💎</p>
                      </div>
                    )}
                    {result.result === 'Enemies' && (
                      <div>
                        <h4 className="font-semibold text-orange-600 dark:text-orange-400">Enemies ⚔️</h4>
                        <p className="text-muted-foreground">Yikes! This suggests some serious challenges ahead. You two clash more than cats and dogs! Maybe it's time to consider different planets? But hey, sometimes enemies make the best frenemies! 😬</p>
                      </div>
                    )}
                    {result.result === 'Single' && (
                      <div>
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400">Single 🙋‍♀️</h4>
                        <p className="text-muted-foreground">Independence is your strength! This suggests focusing on personal growth and self-love. Sometimes the best relationship is the one you have with yourself. Plus, pizza will never let you down! 🍕</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Hidden Background Audio */}
      <AudioPlayer />
    </div>
  )
}
