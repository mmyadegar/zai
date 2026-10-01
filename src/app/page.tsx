'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import {
  MessageCircle,
  Bot,
  Settings as SettingsIcon,
  LayoutDashboard,
  Send,
  Trash2,
  Plus,
  Power,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

// ---------- Types ----------
interface Rule {
  id: string
  keyword: string
  response: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface MessageLog {
  id: string
  sender: string
  content: string
  response: string
  matchedRule: string | null
  source: string
  createdAt: string
}

interface Stats {
  totalRules: number
  activeRules: number
  inactiveRules: number
  totalMessages: number
  messagesLast24h: number
  defaultReply: string
}

// ---------- Main Page ----------
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-rose-100/80 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-200">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">دستیار اینستاگرام</h1>
              <p className="text-xs text-slate-500">پاسخگوی خودکار دایرکت</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ml-1.5"></span>
            نسخه تست
          </Badge>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border border-slate-200 shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">داشبورد</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden sm:inline">قوانین</span>
            </TabsTrigger>
            <TabsTrigger value="simulate" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">شبیه‌ساز</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">لاگ‌ها</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard"><DashboardTab /></TabsContent>
          <TabsContent value="rules"><RulesTab /></TabsContent>
          <TabsContent value="simulate"><SimulateTab /></TabsContent>
          <TabsContent value="logs"><LogsTab /></TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-slate-500">
          ساخته شده با Next.js + Prisma — MVP برای تست سیستم پاسخگوی خودکار
        </div>
      </footer>
    </div>
  )
}

// ---------- Dashboard Tab ----------
function DashboardTab() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading || !stats) {
    return <div className="text-center py-12 text-slate-500">در حال بارگذاری...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">داشبورد</h2>
        <p className="text-sm text-slate-500">نمای کلی از وضعیت سیستم پاسخگوی خودکار</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="کل قوانین"
          value={stats.totalRules}
          icon={<SettingsIcon className="w-5 h-5" />}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="قوانین فعال"
          value={stats.activeRules}
          icon={<Power className="w-5 h-5" />}
          color="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="کل پیام‌ها"
          value={stats.totalMessages}
          icon={<MessageCircle className="w-5 h-5" />}
          color="from-rose-500 to-rose-600"
        />
        <StatCard
          title="پیام‌های ۲۴ ساعت"
          value={stats.messagesLast24h}
          icon={<Clock className="w-5 h-5" />}
          color="from-amber-500 to-amber-600"
        />
      </div>

      <Card className="border-rose-100">
        <CardHeader>
          <CardTitle className="text-base">پاسخ پیش‌فرض</CardTitle>
          <CardDescription>وقتی هیچ کلمه کلیدی تطابق نداشت، این پیام ارسال می‌شه</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-rose-50 rounded-lg p-4 text-sm text-slate-700 border border-rose-100">
            {stats.defaultReply}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            برای تغییر این پیام، به تب «شبیه‌ساز» برید.
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">این یک نسخه تستی است</p>
              <p className="text-amber-800">
                فعلاً پیام‌ها به‌صورت شبیه‌سازی‌شده پردازش می‌شن. برای اتصال واقعی به اینستاگرام
                باید Meta Graph API و Instagram Business Account راه‌اندازی بشه.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title, value, icon, color,
}: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-5">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white mb-3`}>
          {icon}
        </div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500 mt-1">{title}</div>
      </CardContent>
    </Card>
  )
}

// ---------- Rules Tab ----------
function RulesTab() {
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [newKeyword, setNewKeyword] = useState('')
  const [newResponse, setNewResponse] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/rules')
      const data = await res.json()
      setRules(data.rules || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyword.trim() || !newResponse.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: newKeyword, response: newResponse }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'خطا', description: data.error || 'ذخیره نشد', variant: 'destructive' })
        return
      }
      toast({ title: '✅ قانون اضافه شد', description: `کلمه: ${newKeyword}` })
      setNewKeyword('')
      setNewResponse('')
      load()
    } catch (e) {
      toast({ title: 'خطا', description: 'ارتباط با سرور ناموفق بود', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/rules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !current }),
      })
      load()
    } catch (e) {
      toast({ title: 'خطا', description: 'تغییر وضعیت ناموفق بود', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string, keyword: string) => {
    if (!confirm(`قانون «${keyword}» حذف بشه؟`)) return
    try {
      await fetch(`/api/rules/${id}`, { method: 'DELETE' })
      toast({ title: '🗑️ حذف شد', description: `قانون «${keyword}» حذف شد` })
      load()
    } catch (e) {
      toast({ title: 'خطا', description: 'حذف ناموفق بود', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">قوانین پاسخگویی</h2>
        <p className="text-sm text-slate-500">برای هر کلمه کلیدی، یک پاسخ خودکار تعریف کنید</p>
      </div>

      {/* Add new rule */}
      <Card className="border-rose-100">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-rose-500" />
            افزودن قانون جدید
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="keyword">کلمه کلیدی</Label>
              <Input
                id="keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="مثلاً: قیمت، ارسال، ساعت کاری"
                dir="rtl"
              />
              <p className="text-xs text-slate-400">اگر این کلمه داخل پیام کاربر باشه، پاسخ مربوطه ارسال می‌شه</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="response">پاسخ خودکار</Label>
              <Textarea
                id="response"
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="مثلاً: سلام! برای اطلاع از قیمت‌ها به لینک زیر مراجعه کنید: ..."
                dir="rtl"
                rows={3}
              />
            </div>
            <Button type="submit" disabled={submitting || !newKeyword.trim() || !newResponse.trim()} className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700">
              {submitting ? 'در حال افزودن...' : 'افزودن قانون'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List of rules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-700">قوانین موجود ({rules.length})</h3>
        </div>
        {loading ? (
          <div className="text-center py-8 text-slate-500">در حال بارگذاری...</div>
        ) : rules.length === 0 ? (
          <Card className="border-dashed border-slate-300">
            <CardContent className="py-10 text-center text-slate-400">
              هنوز قانونی اضافه نشده. اولین قانون رو اضافه کنید!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <Card key={rule.id} className={`border-slate-200 transition-all ${!rule.isActive ? 'opacity-50' : ''}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-mono">
                          {rule.keyword}
                        </Badge>
                        {!rule.isActive && (
                          <Badge variant="secondary" className="text-xs">غیرفعال</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{rule.response}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => handleToggle(rule.id, rule.isActive)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(rule.id, rule.keyword)}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- Simulate Tab ----------
function SimulateTab() {
  const [sender, setSender] = useState('test_user_1')
  const [content, setContent] = useState('')
  const [defaultReply, setDefaultReply] = useState('')
  const [result, setResult] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [savingDefault, setSavingDefault] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      setDefaultReply(data.settings?.defaultReply || '')
    }).catch(console.error)
  }, [])

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setResult(null)
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, content }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'خطا', description: data.error, variant: 'destructive' })
        return
      }
      setResult(data)
    } catch (e) {
      toast({ title: 'خطا', description: 'ارتباط با سرور ناموفق بود', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveDefault = async () => {
    setSavingDefault(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'defaultReply', value: defaultReply }),
      })
      toast({ title: '✅ ذخیره شد', description: 'پاسخ پیش‌فرض ذخیره شد' })
    } catch (e) {
      toast({ title: 'خطا', description: 'ذخیره نشد', variant: 'destructive' })
    } finally {
      setSavingDefault(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">شبیه‌ساز پیام</h2>
        <p className="text-sm text-slate-500">یک پیام نمونه بفرستید و ببینید سیستم چه پاسخی می‌ده</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Simulator form */}
        <Card className="border-rose-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              تست پیام ورودی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSimulate} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="sender">فرستنده (یوزرنیم)</Label>
                <Input
                  id="sender"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="username"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="content">متن پیام</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="مثلاً: سلام، قیمت محصول چنده؟"
                  dir="rtl"
                  rows={3}
                />
              </div>
              <Button
                type="submit"
                disabled={submitting || !content.trim()}
                className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
              >
                <Send className="w-4 h-4 ml-2" />
                {submitting ? 'در حال پردازش...' : 'شبیه‌سازی'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result preview */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">نتیجه پاسخگویی</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-12 text-slate-400">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">بعد از شبیه‌سازی، نتیجه اینجا نشون داده می‌شه</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Incoming message bubble */}
                <div className="flex flex-col items-start">
                  <div className="text-xs text-slate-500 mb-1 px-1">{result.sender}</div>
                  <div className="bg-slate-100 rounded-2xl rounded-tr-md px-4 py-2 max-w-[85%]">
                    <p className="text-sm text-slate-800 whitespace-pre-wrap break-words">{result.receivedContent}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 px-1">پیام ورودی</div>
                </div>

                {/* Outgoing auto-reply bubble */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <Bot className="w-3 h-3 text-rose-500" />
                    <span className="text-xs text-slate-500">پاسخ خودکار</span>
                  </div>
                  <div className="bg-gradient-to-br from-rose-500 to-purple-600 text-white rounded-2xl rounded-tl-md px-4 py-2 max-w-[85%]">
                    <p className="text-sm whitespace-pre-wrap break-words">{result.autoReply}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 px-1">
                    {result.usedDefault ? 'پاسخ پیش‌فرض' : `تطابق با قانون: ${result.matchedRule.keyword}`}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2 text-xs">
                  {result.usedDefault ? (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      <AlertCircle className="w-3 h-3 ml-1" />
                      بدون تطابق — استفاده از پیش‌فرض
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 ml-1" />
                      تطابق یافت شد
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Default reply settings */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader>
          <CardTitle className="text-base">پاسخ پیش‌فرض</CardTitle>
          <CardDescription>اگر هیچ کلمه کلیدی تطابق نداشت، این پیام ارسال می‌شه</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Textarea
              value={defaultReply}
              onChange={(e) => setDefaultReply(e.target.value)}
              dir="rtl"
              rows={2}
            />
            <Button
              onClick={handleSaveDefault}
              disabled={savingDefault}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              {savingDefault ? 'در حال ذخیره...' : 'ذخیره پاسخ پیش‌فرض'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ---------- Logs Tab ----------
function LogsTab() {
  const [logs, setLogs] = useState<MessageLog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/logs?limit=50')
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleClear = async () => {
    if (!confirm('همه لاگ‌ها پاک بشن؟')) return
    try {
      await fetch('/api/logs', { method: 'DELETE' })
      toast({ title: '🧹 پاک شد', description: 'همه لاگ‌ها حذف شدند' })
      load()
    } catch (e) {
      toast({ title: 'خطا', description: 'پاکسازی ناموفق بود', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">لاگ پیام‌ها</h2>
          <p className="text-sm text-slate-500">تاریخچه پیام‌های شبیه‌سازی‌شده و پاسخ‌های ارسالی</p>
        </div>
        {logs.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear} className="text-rose-600 border-rose-200 hover:bg-rose-50">
            <Trash2 className="w-4 h-4 ml-1.5" />
            پاکسازی
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">در حال بارگذاری...</div>
      ) : logs.length === 0 ? (
        <Card className="border-dashed border-slate-300">
          <CardContent className="py-12 text-center text-slate-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">هنوز پیامی ثبت نشده. به تب «شبیه‌ساز» برید و یه پیام تست بفرستید!</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px] rounded-lg border border-slate-200 bg-white">
          <div className="p-4 space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-800">@{log.sender}</span>
                    {log.matchedRule ? (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px]">
                        تطابق یافت شد
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-[10px]">
                        پیش‌فرض
                      </Badge>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400" dir="ltr">
                    {new Date(log.createdAt).toLocaleString('fa-IR')}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="bg-slate-100 rounded-lg px-3 py-1.5 text-sm text-slate-700">
                    <span className="text-[10px] text-slate-400 ml-2">ورودی:</span>
                    {log.content}
                  </div>
                  <div className="bg-rose-50 rounded-lg px-3 py-1.5 text-sm text-rose-800 border border-rose-100">
                    <span className="text-[10px] text-rose-400 ml-2">پاسخ:</span>
                    {log.response}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
