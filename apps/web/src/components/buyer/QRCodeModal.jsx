"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Modal from "@/components/ui/Modal";

export function QRCodeModal({ onClose, open, passportUrl, productName }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(passportUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <Modal label={`QR code for ${productName}`} onClose={handleClose} open={open}>
      <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <button
          aria-label="Close QR code"
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-muted hover:text-primary sm:right-3 sm:top-3"
          onClick={handleClose}
          type="button"
        >
          <span className="material-symbols-outlined text-[21px]">close</span>
        </button>

        <div className="pr-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-terracotta">Digital Craft Passport</span>
          <h2 className="mt-1 text-xl font-bold leading-tight text-primary">Scan to view this craft journey</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-secondary">{productName}</p>
        </div>

        <div className="mx-auto my-6 flex w-full max-w-[252px] items-center justify-center rounded-xl border border-border bg-white p-3 sm:p-4">
          <QRCodeSVG
            bgColor="#ffffff"
            className="h-auto w-full max-w-[220px]"
            fgColor="#060607"
            level="M"
            marginSize={1}
            size={220}
            title={`Passport QR code for ${productName}`}
            value={passportUrl}
          />
        </div>

        <p className="break-all rounded-lg bg-surface-muted px-3 py-2 text-center font-mono text-[10px] text-secondary">
          {passportUrl}
        </p>
        <button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-[12px] font-semibold text-white transition-colors hover:bg-neutral-800" onClick={handleCopy} type="button">
          <span className="material-symbols-outlined text-[17px]">content_copy</span>
          {copied ? "Passport link copied" : "Copy passport link"}
        </button>
      </div>
    </Modal>
  );
}
