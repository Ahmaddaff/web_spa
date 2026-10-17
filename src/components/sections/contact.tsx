"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Mail, MapPin, Phone, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { SectionHeading } from "@/components/section-heading";
import { profile, socials } from "@/data/site-data";

type ContactItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string | null;
};

const contactItems: ContactItem[] = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: profile.phone,
    href: `https://wa.me/${profile.phoneRaw}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location,
    href: null,
  },
];

export function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      form.subject || `Message from ${form.name}`
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative scroll-mt-24 py-24"
    >
      <div className="container">
        <SectionHeading
          index="05"
          eyebrow=".contact()"
          title="Let's Work Together"
          description="Punya ide proyek, ajakan kolaborasi, atau sekadar ingin menyapa? Jangan ragu untuk menghubungi saya."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 font-mono text-xs text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              avg. response &lt; 24h
            </div>

            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="divide-y divide-white/5 p-0">
                {contactItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          data-cursor={
                            item.href.startsWith("mailto:") ? "MAIL" : "CHAT"
                          }
                          className="truncate text-sm font-medium text-slate-200 transition hover:text-cyan-300"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-slate-200">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="p-5">
                <p className="text-sm text-slate-400">Temui saya di:</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      title={social.name}
                      data-cursor="OPEN"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                      <social.icon className="h-5 w-5" />
                      <span className="sr-only">{social.name}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="p-6">
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-10 text-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/30"
                    >
                      <Check className="h-8 w-8" />
                    </motion.span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-slate-100">
                      Pesan siap dikirim!
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-slate-400">
                      Aplikasi email kamu akan terbuka. Jika tidak, kirim
                      langsung ke {profile.email}.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => setSent(false)}
                    >
                      Kirim pesan lain
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="name"
                          className="text-xs font-medium uppercase tracking-wider text-slate-400"
                        >
                          Nama
                        </label>
                        <Input
                          id="name"
                          required
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="Nama kamu"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="email"
                          className="text-xs font-medium uppercase tracking-wider text-slate-400"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="subject"
                        className="text-xs font-medium uppercase tracking-wider text-slate-400"
                      >
                        Subjek
                      </label>
                      <Input
                        id="subject"
                        required
                        value={form.subject}
                        onChange={(e) =>
                          setForm({ ...form, subject: e.target.value })
                        }
                        placeholder="Kolaborasi / Projek / Halo"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="message"
                        className="text-xs font-medium uppercase tracking-wider text-slate-400"
                      >
                        Pesan
                      </label>
                      <Textarea
                        id="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        placeholder="Tulis pesan kamu..."
                      />
                    </div>

                    <MagneticButton>
                      <Button type="submit" className="w-full" data-cursor="SEND">
                        <Send className="h-4 w-4" />
                        Kirim Pesan
                      </Button>
                    </MagneticButton>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
