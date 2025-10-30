"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Turnstile from "react-turnstile"

export default function CaptchaDialog({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean
  onConfirm: (token: string, phone?: string) => void
  onClose: () => void
}) {
  const [token, setToken] = useState("")
  const [phone, setPhone] = useState("")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verificación rápida</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onVerify={(token) => console.log("Verified:", token)}
          />
          <Input
            placeholder="¿Deseas una llamada del agente? (opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button disabled={!token} onClick={() => onConfirm(token, phone)}>
            No soy un robot buscando casa 🏡
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

