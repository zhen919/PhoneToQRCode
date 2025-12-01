"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {Download, Phone, Hash, CopyIcon, CheckIcon, Link} from "lucide-react"
import type { OrderItem } from "@/app/page"
import QRCode from "qrcode"

interface QRCodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: OrderItem | null,
    useLinkMode?: boolean // 添加跳转模式参数
}

export function QRCodeModal({ open, onOpenChange, item, useLinkMode = false }: QRCodeModalProps) {
    const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null)
    const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
        setCanvasEl(node)
    }, []);

    const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
      if (open && item && canvasEl) {
          const phone = item.phone.replace("转", ',');

          const context = useLinkMode
              ? `${window.location.origin}/call?phone=${encodeURIComponent(phone)}&orderId=${encodeURIComponent(item.orderId)}`
              : `tel:${phone}`;

          QRCode.toCanvas(
              canvasEl,
              context,
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

  }, [open, item, canvasEl, useLinkMode]);

    const handleDownload = () => {
        if (!canvasEl || !item) return;

        const link = document.createElement("a")
        link.download = `qrcode-${item.orderId}-${item.phone}.png`
        link.href = canvasEl.toDataURL("image/png")
        link.click();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(item!.orderId).then().catch(() => { console.error('复制数据出错！') });
        setCopied(true);
    };

    useEffect(() => {
        if (!copied) return;

        const timer = setTimeout(() => {
            setCopied(false);
        }, 2000);

        // 组件卸载或 copied 重置时清除定时器
        return () => clearTimeout(timer);
    }, [copied]);

  if (!item) return null;

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
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {useLinkMode ? (
                      <>
                          <Link className="h-3 w-3" />
                          <span>跳转页面模式</span>
                      </>
                  ) : (
                      <>
                          <Phone className="h-3 w-3" />
                          <span>直接拨号模式</span>
                      </>
                  )}
              </div>
          </div>

          <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <Hash className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">订单编号</p>
                <div className="flex items-center gap-3">
                    <p className="font-mono text-sm text-foreground">{item.orderId}</p>

                    {
                        !copied ? <CopyIcon size={16} className="cursor-pointer" onClick={handleCopy} /> : <CheckIcon size={16} />
                    }
                </div>
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
