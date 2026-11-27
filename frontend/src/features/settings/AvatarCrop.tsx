import { ImageIcon } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Button } from '@/design-system/Button';
import { Modal } from '@/design-system/Modal';

type View = { x: number; y: number; z: number; base: number; size: number; w: number; h: number };

/**
 * Recadrage carré de l'avatar (ACC-04) : glisser pour déplacer, molette ou curseur pour zoomer,
 * flèches du clavier pour ajuster. Renvoie une image JPEG de 400 × 400.
 */
export function AvatarCrop({
  src,
  onCancel,
  onApply,
  busy,
}: {
  src: string;
  onCancel: () => void;
  onApply: (blob: Blob) => void;
  busy?: boolean;
}) {
  const area = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const [v, setV] = useState<View | null>(null);
  const [preview, setPreview] = useState<string>('');
  const drag = useRef<{ x: number; y: number } | null>(null);

  const clamp = (n: View): View => {
    const s = n.base * n.z;
    return {
      ...n,
      x: Math.min(0, Math.max(n.size - n.w * s, n.x)),
      y: Math.min(0, Math.max(n.size - n.h * s, n.y)),
    };
  };

  const onLoad = () => {
    const el = img.current;
    const box = area.current;
    if (!el || !box) return;
    const size = box.clientWidth;
    const w = el.naturalWidth;
    const h = el.naturalHeight;
    const base = size / Math.min(w, h);
    setV({ x: (size - w * base) / 2, y: (size - h * base) / 2, z: 1, base, size, w, h });
    box.focus();
  };

  const render = (out: number) => {
    const el = img.current;
    if (!el || !v) return null;
    const c = document.createElement('canvas');
    c.width = c.height = out;
    const s = v.base * v.z;
    c.getContext('2d')?.drawImage(el, -v.x / s, -v.y / s, v.size / s, v.size / s, 0, 0, out, out);
    return c;
  };

  // Aperçu dans le profil et sur les posts
  useEffect(() => {
    if (!v) return;
    const t = setTimeout(() => setPreview(render(160)?.toDataURL('image/jpeg', 0.9) ?? ''), 40);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);

  const zoom = (z: number) =>
    setV((p) => {
      if (!p) return p;
      const c = p.size / 2;
      const nz = Math.min(3, Math.max(1, z));
      const k = nz / p.z;
      return clamp({ ...p, z: nz, x: c - (c - p.x) * k, y: c - (c - p.y) * k });
    });

  const onKey = (e: KeyboardEvent) => {
    const d = (
      { ArrowLeft: [8, 0], ArrowRight: [-8, 0], ArrowUp: [0, 8], ArrowDown: [0, -8] } as Record<
        string,
        [number, number]
      >
    )[e.key];
    if (!d) return;
    e.preventDefault();
    setV((p) => p && clamp({ ...p, x: p.x + d[0], y: p.y + d[1] }));
  };

  useEffect(() => {
    const box = area.current;
    if (!box) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setV((p) => {
        if (!p) return p;
        const c = p.size / 2;
        const nz = Math.min(3, Math.max(1, p.z - e.deltaY / 500));
        const k = nz / p.z;
        return clamp({ ...p, z: nz, x: c - (c - p.x) * k, y: c - (c - p.y) * k });
      });
    };
    box.addEventListener('wheel', onWheel, { passive: false });
    return () => box.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <Modal open onClose={onCancel} title="Recadrer la photo">
      <div
        ref={area}
        tabIndex={0}
        role="application"
        aria-label="Zone de recadrage : glissez pour déplacer, flèches du clavier pour ajuster"
        onKeyDown={onKey}
        onPointerDown={(e: PointerEvent) => {
          if (!v) return;
          drag.current = { x: e.clientX - v.x, y: e.clientY - v.y };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (d) setV((p) => p && clamp({ ...p, x: e.clientX - d.x, y: e.clientY - d.y }));
        }}
        onPointerUp={() => (drag.current = null)}
        className="bg-black relative mx-auto aspect-square w-full max-w-[352px] cursor-grab touch-none overflow-hidden rounded-sm select-none active:cursor-grabbing"
      >
        <img
          ref={img}
          src={src}
          alt=""
          onLoad={onLoad}
          className="pointer-events-none absolute top-0 left-0 max-w-none origin-top-left"
          style={{
            transform: v ? `translate(${v.x}px, ${v.y}px) scale(${v.base * v.z})` : undefined,
          }}
        />
        <span className="pointer-events-none absolute inset-0 border border-dashed border-white/45" />
        <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_999px_rgba(0,0,0,0.55)] outline outline-white/60" />
      </div>
      <div className="flex items-center gap-3 text-text-3">
        <ImageIcon aria-hidden size={16} />
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={v?.z ?? 1}
          aria-label="Zoom"
          onChange={(e) => zoom(Number(e.target.value))}
          className="flex-1 accent-text"
        />
        <ImageIcon aria-hidden size={22} />
      </div>
      <div className="flex items-center justify-center gap-4 text-caption text-text-3">
        <span
          className="size-[72px] rounded-full bg-avatar bg-cover"
          style={{ backgroundImage: preview ? `url(${preview})` : undefined }}
        />
        <span
          className="size-10 rounded-full bg-avatar bg-cover"
          style={{ backgroundImage: preview ? `url(${preview})` : undefined }}
        />
        <span>Aperçu dans le profil et sur les posts</span>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          loading={busy}
          disabled={!v}
          onClick={() => render(400)?.toBlob((b) => b && onApply(b), 'image/jpeg', 0.9)}
        >
          Appliquer
        </Button>
      </div>
    </Modal>
  );
}
