import { useParams } from 'react-router';

type Props = {
  title: string;
  /** Identifiants de la spec fonctionnelle que la page couvrira. */
  spec?: string;
  /** Sprint où la page sera codée (docs/FRONT_PLAN.md). */
  sprint?: string;
};

/** Page vide : elle sera remplacée par la vraie page dans sa branche front/feat/... */
export function Placeholder({ title, spec, sprint }: Props) {
  const params = useParams();
  const shown = Object.entries(params).filter(([key]) => key !== '*');
  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {shown.length > 0 && (
        <p className="mt-2 text-sm text-neutral-400">
          {shown.map(([key, value]) => `${key} : ${value}`).join(' · ')}
        </p>
      )}
      <p className="mt-4 text-neutral-400">
        Page à venir{sprint ? ` (${sprint})` : ''}.{spec ? ` Spec : ${spec}.` : ''}
      </p>
    </section>
  );
}
