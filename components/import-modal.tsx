"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, FileSpreadsheet } from "lucide-react"

interface ImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (items: { orderId: string; phone: string }[]) => void
}

export function ImportModal({ open, onOpenChange, onImport }: ImportModalProps) {
  const [inputData, setInputData] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    setError("")

    if (!inputData.trim()) {
      setError("请输入数据")
      return
    }

    const lines = inputData.trim().split("\n")
    const items: { orderId: string; phone: string }[] = []
    const errors: string[] = []

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      // 支持 tab 或多个空格作为分隔符
      const parts = trimmedLine.split(/\t+|\s{2,}/)

      if (parts.length >= 2) {
        const orderId = parts[0].trim()
        const phone = parts[1].trim()

        if (orderId && phone) {
          items.push({ orderId, phone })
        } else {
          errors.push(`第 ${index + 1} 行：数据不完整`)
        }
      } else {
        errors.push(`第 ${index + 1} 行：格式错误，需要两列数据`)
      }
    })

    if (errors.length > 0 && items.length === 0) {
      setError(errors.slice(0, 3).join("；") + (errors.length > 3 ? "..." : ""))
      return
    }

    if (items.length === 0) {
      setError("未解析到有效数据")
      return
    }

    onImport(items)
    setInputData("")
    setError("")
    onOpenChange(false)
  }

  const handleClose = () => {
    setInputData("")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            导入数据
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            从 Excel 复制两列数据（订单编号、手机号码），粘贴到下方输入框
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data-input" className="text-foreground">
              数据内容
            </Label>
            <Textarea
              id="data-input"
              placeholder={`示例格式（Tab 分隔）：\nORD001\t13800138000\nORD002\t13900139000`}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="min-h-[200px] font-mono text-sm bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="rounded-md bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">提示：</strong>从 Excel 复制的数据会自动使用 Tab
              分隔。每行一条记录，第一列为订单编号，第二列为手机号码。
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleSubmit}>提交</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
