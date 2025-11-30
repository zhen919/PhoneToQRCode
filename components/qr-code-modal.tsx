"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Phone, Hash } from "lucide-react"
import type { OrderItem } from "@/app/page"
import QRCode from "qrcode"

interface QRCodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: OrderItem | null
}

export function QRCodeModal({ open, onOpenChange, item }: QRCodeModalProps) {
    const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null)
    const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
        setCanvasEl(node)
    }, []);

  useEffect(() => {
      if (open && item && canvasEl) {
          const phone = item.phone.replace("转", ',');

          QRCode.toCanvas(
              canvasEl,
              `tel:${phone}`,
              {
                  width: 200,
                  margin: 2,
                  color: {
                      dark: "#000000",
                      light: "#ffffff",
                  },
              },
              (error) => {
                  if (error) console.error("QR Code error:", error)
              },
          )
      }

  }, [open, item, canvasEl]);

    const handleDownload = () => {
        if (!canvasEl || !item) return;

        const link = document.createElement("a")
        link.download = `qrcode-${item.orderId}-${item.phone}.png`
        link.href = canvasEl.toDataURL("image/png")
        link.click();
    }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">二维码预览</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-lg bg-white p-4">
              <canvas ref={canvasRef} />
            </div>
          </div>

          <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <Hash className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">订单编号</p>
                <p className="font-mono text-sm text-foreground">{item.orderId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">手机号码</p>
                <p className="font-mono text-sm text-foreground">{item.phone}</p>
              </div>
            </div>
          </div>

          <Button onClick={handleDownload} className="w-full gap-2">
            <Download className="h-4 w-4" />
            下载二维码
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
