"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Turnstile from "react-turnstile"

export default function CaptchaDialog({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean
  onConfirm: (token: string) => void
  onClose: () => void
}) {
  const [token, setToken] = useState("")
  const [notifications, setNotifications] = useState<"yes" | "no">("yes")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verificación rápida</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* CAPTCHA */}
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onVerify={(token) => setToken(token)}
          />

          {/* Pregunta de notificaciones */}
          <div className="flex items-center justify-center space-y-2">
            <Label className="text-sm font-medium">
              ¿Deseas recibir notificaciones?
            </Label>
            <RadioGroup
              value={notifications}
              onValueChange={(val) => setNotifications(val as "yes" | "no")}
              className="rounded-md border p-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button disabled={!token} onClick={() => onConfirm(token)}>
            No soy un robot buscando casa 🏡
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

