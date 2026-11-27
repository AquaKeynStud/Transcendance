import { useParams } from 'react-router';
import { PageHead } from '@/app/layouts/PageHead';

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
    <>
      <PageHead
        title={title}
        sub={
          shown.length > 0
            ? shown.map(([key, value]) => `${key} : ${value}`).join(' · ')
            : undefined
        }
      />
      <p className="text-post text-text-2 px-5 py-6">
        Page à venir{sprint ? ` (${sprint})` : ''}.{spec ? ` Spec : ${spec}.` : ''}
      </p>
    </>
  );
}
