"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ImportModal } from "@/components/import-modal"
import { QRCodeModal } from "@/components/qr-code-modal"
import { Plus, Trash2, QrCode } from "lucide-react"

export interface OrderItem {
  id: string
  orderId: string
  phone: string
}

const STORAGE_KEY = "qr-code-orders"

export default function HomePage() {
  const [data, setData] = useState<OrderItem[]>([])
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null)
  const [isQROpen, setIsQROpen] = useState(false)

  // 从 localStorage 加载数据
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setData(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse stored data:", e)
      }
    }
  }, [])

  // 保存数据到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const handleImport = (items: { orderId: string; phone: string }[]) => {
    const newItems: OrderItem[] = items.map((item) => ({
      id: crypto.randomUUID(),
      orderId: item.orderId,
      phone: item.phone,
    }))
    setData((prev) => [...prev, ...newItems])
  }

  const handleClear = () => {
    if (confirm("确定要清空所有数据吗？")) {
      setData([])
    }
  }

  const handleGenerate = (item: OrderItem) => {
    setSelectedItem(item)
    setIsQROpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <QrCode className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">电话号码二维码生成器</h1>
              <p className="text-sm text-muted-foreground">批量导入订单数据，快速生成二维码</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">共 {data.length} 条记录</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={data.length === 0}
              className="gap-2 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              清空数据
            </Button>
            <Button onClick={() => setIsImportOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              导入数据
            </Button>
          </div>
        </div>

        <DataTable data={data} onGenerate={handleGenerate} />
      </main>

      <ImportModal open={isImportOpen} onOpenChange={setIsImportOpen} onImport={handleImport} />

      <QRCodeModal open={isQROpen} onOpenChange={setIsQROpen} item={selectedItem} />
    </div>
  )
}
