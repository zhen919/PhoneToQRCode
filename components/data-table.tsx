"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, QrCode } from "lucide-react"
import type { OrderItem } from "@/app/page"

interface DataTableProps {
  data: OrderItem[]
  onGenerate: (item: OrderItem) => void
}

const PAGE_SIZE = 10

export function DataTable({ data, onGenerate }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const currentData = data.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <QrCode className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground">暂无数据</p>
          <p className="text-sm text-muted-foreground">点击上方"导入数据"按钮添加订单</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium">序号</TableHead>
            <TableHead className="text-muted-foreground font-medium">订单编号</TableHead>
            <TableHead className="text-muted-foreground font-medium">手机号码</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item, index) => (
            <TableRow key={item.id} className="border-border">
              <TableCell className="text-foreground font-mono">{startIndex + index + 1}</TableCell>
              <TableCell className="text-foreground font-mono">{item.orderId}</TableCell>
              <TableCell className="text-foreground font-mono">{item.phone}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" onClick={() => onGenerate(item)} className="gap-1.5">
                  <QrCode className="h-3.5 w-3.5" />
                  生成
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            显示 {startIndex + 1} - {Math.min(endIndex, data.length)} 条，共 {data.length} 条
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number
              if (totalPages <= 5) {
                page = i + 1
              } else if (currentPage <= 3) {
                page = i + 1
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i
              } else {
                page = currentPage - 2 + i
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => goToPage(page)}
                  className="h-8 w-8"
                >
                  {page}
                </Button>
              )
            })}
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
