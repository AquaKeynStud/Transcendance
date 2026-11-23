import { Play } from 'lucide-react';
import type { Ref } from 'react';
import { useToast } from '@/design-system/feedback';
import { cx } from '@/lib/cx';
import { duration } from '@/lib/format';
import type { Media } from '@/lib/types';

const PH = ['var(--ph1)', 'var(--ph2)', 'var(--ph3)'];
const isLand = (m: Media) => m.width > m.height;

/** Format de l'aperçu quand tous les médias sont horizontaux : le leur s'il est seul, 4:3 sinon (§4.7). */
function landRatio(media: Media[]) {
  if (!media.length || !media.every(isLand)) return null;
  return media.length === 1 ? media[0]!.width / media[0]!.height : 4 / 3;
}

function ratioLabel(m: Media) {
  const r = m.width / m.height;
  const known: [number, number][] = [
    [16, 9],
    [3, 2],
    [4, 3],
    [1, 1],
    [4, 5],
    [3, 4],
    [2, 3],
    [9, 16],
  ];
  const best = known.reduce((a, k) =>
    Math.abs(k[0] / k[1] - r) < Math.abs(a[0] / a[1] - r) ? k : a,
  );
  return `${best[0]}:${best[1]}`;
}

/**
 * MediaGrid (20) : hauteur fixe (--media-h) quel que soit le nombre de médias.
 * Tous horizontaux : aperçu en grand, pleine largeur ; sa hauteur est posée par la troncature (useClamp).
 * Un vertical seul garde sa largeur naturelle.
 */
export function MediaGrid({ media, ref }: { media: Media[]; ref?: Ref<HTMLDivElement> }) {
  const toast = useToast();
  if (!media.length) return null;
  const land = landRatio(media);
  const n = media.length;
  const soloV = n === 1 && !land;
  return (
    <div
      ref={ref}
      data-ar={land ?? undefined}
      style={land ? { aspectRatio: String(land) } : undefined}
      className={cx(
        'relative mt-3 grid gap-0.5 overflow-hidden rounded-md border border-line',
        !land && 'h-(--media-h)',
        n === 2 && 'grid-cols-2',
        n === 3 && 'grid-cols-[2fr_1fr] grid-rows-2 [&>:first-child]:row-span-2',
        n === 4 && 'grid-cols-2 grid-rows-2',
        soloV && 'w-fit max-w-full',
      )}
    >
      {media.map((m, i) => (
        <button
          type="button"
          key={m.id}
          aria-label={`${m.type === 'video' ? 'Vidéo' : m.type === 'gif' ? 'GIF' : 'Image'} ${i + 1} sur ${n}, afficher en grand`}
          onClick={() => toast('Plein écran : prévu au S5 (MEDIA-08).', { type: 'info' })}
          className="relative min-h-0 min-w-0 cursor-zoom-in bg-cover bg-center"
          style={{
            backgroundImage: m.url && m.type !== 'video' ? `url(${m.url})` : PH[i % 3],
            aspectRatio: soloV ? `${m.width} / ${m.height}` : undefined,
            height: soloV ? '100%' : undefined,
          }}
        >
          {m.type === 'video' ? (
            <>
              {m.url && (
                <video
                  src={m.url}
                  muted
                  preload="metadata"
                  className="absolute inset-0 size-full object-cover"
                />
              )}
              <span className="bg-black/55 absolute inset-0 m-auto grid size-13 place-items-center rounded-full text-white">
                <Play aria-hidden size={22} fill="currentColor" stroke="none" className="ml-0.5" />
              </span>
              {m.duration !== null && (
                <span className="bg-black/55 absolute right-2 bottom-2 rounded-[4px] px-1.5 py-px text-[11px] font-bold text-white">
                  {duration(m.duration)}
                </span>
              )}
            </>
          ) : (
            (!m.url || m.type === 'gif') && (
              <span className="bg-black/55 absolute bottom-2 left-2 rounded-[4px] px-1.5 py-px text-[11px] font-bold text-white">
                {m.type === 'gif' ? 'GIF' : ''}
                {m.type === 'gif' && !m.url ? ' · ' : ''}
                {!m.url && ratioLabel(m)}
              </span>
            )
          )}
        </button>
      ))}
    </div>
  );
}
