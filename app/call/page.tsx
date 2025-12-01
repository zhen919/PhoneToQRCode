"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Phone, Hash, AlertCircle } from "lucide-react"
import { Suspense } from "react"

function CallContent() {
    const searchParams = useSearchParams()
    const phone = searchParams.get("phone")
    const orderId = searchParams.get("orderId")

    const handleCall = () => {
        if (phone) {
            window.location.href = `tel:${phone}`
        }
    }

    if (!phone) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-sm rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                    <h1 className="mt-4 text-lg font-semibold text-foreground">无效链接</h1>
                    <p className="mt-2 text-sm text-muted-foreground">未找到电话号码信息，请确认二维码是否正确。</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                {/* Logo */}
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                        <Phone className="h-8 w-8 text-primary-foreground" />
                    </div>
                </div>

                {/* 信息卡片 */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
                    <h1 className="text-center text-lg font-semibold text-foreground mb-6">确认拨打电话</h1>

                    <div className="space-y-4">
                        {orderId && (
                            <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Hash className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">订单编号</p>
                                    <p className="font-mono text-sm font-medium text-foreground">{orderId}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">手机号码</p>
                                <p className="font-mono text-lg font-semibold text-foreground">{phone}</p>
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleCall} className="mt-6 w-full gap-2 h-12 text-base" size="lg">
                        <Phone className="h-5 w-5" />
                        立即拨打
                    </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground">点击按钮将调用手机拨号功能</p>
            </div>
        </div>
    )
}

export default function CallPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">加载中...</div>
                </div>
            }
        >
            <CallContent />
        </Suspense>
    )
}
