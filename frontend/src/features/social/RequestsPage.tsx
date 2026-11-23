import { Inbox, Info } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button, buttonClass } from '@/design-system/Button';
import { useToast } from '@/design-system/feedback';
import { EmptyState, ListNote } from '@/design-system/misc';
import { PageHead } from '@/design-system/PageHead';
import { PostSkeleton } from '@/design-system/Spinner';
import { timeAgo } from '@/lib/format';
import { useMe } from '@/lib/session';
import { profileUrl } from '@/lib/urls';
import { useAnswerRequest, useRequests } from '@/features/social/api';
import { FollowButton } from '@/features/social/FollowButton';
import { UserRow } from '@/features/social/UserRow';

/** Demandes d'abonnement reçues (SOC-03). */
export function RequestsPage() {
  const { data: me } = useMe();
  const q = useRequests();
  const answer = useAnswerRequest();
  const toast = useToast();
  // Réponse donnée pendant la visite : la ligne reste, avec « Acceptée » ou « Refusée ».
  const [done, setDone] = useState<Record<string, 'ok' | 'no'>>({});
  const list = q.data?.pages.flatMap((p) => p.results) ?? [];
  const pending = list.filter((r) => !done[r.user.username]).length;

  const reply = (username: string, accept: boolean) =>
    answer.mutate(
      { username, accept },
      {
        onSuccess: (u) => {
          setDone((d) => ({ ...d, [username]: accept ? 'ok' : 'no' }));
          toast(
            accept
              ? `@${u.username} peut maintenant voir vos posts`
              : `Demande de @${u.username} refusée`,
          );
        },
        onError: (e) => toast(e.message, { type: 'error' }),
      },
    );

  return (
    <>
      <PageHead
        title="Demandes d’abonnement"
        sub={pending ? `${pending} en attente` : 'Aucune demande en attente'}
        back={me ? profileUrl(me.username) : true}
      />
      {q.isPending ? (
        <div aria-busy="true">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : list.length ? (
        <>
          <ListNote icon={Info}>
            Accepter une demande donne accès à vos posts, réponses et médias. Seule l’acceptation
            est notifiée.
          </ListNote>
          {list.map((r) => {
            const state = done[r.user.username];
            return (
              <UserRow
                key={r.user.id}
                user={r.user}
                meta={<span>· il y a {timeAgo(r.created_at)}</span>}
                end={
                  state === 'ok' ? (
                    <>
                      <span className="text-sm text-text-3">Acceptée</span>
                      <FollowButton user={r.user} size="sm" />
                    </>
                  ) : state === 'no' ? (
                    <span className="text-sm text-text-3">Refusée</span>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => reply(r.user.username, true)}>
                        Accepter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reply(r.user.username, false)}
                      >
                        Refuser
                      </Button>
                    </>
                  )
                }
              />
            );
          })}
        </>
      ) : (
        <EmptyState
          icon={Inbox}
          title="Aucune demande"
          action={
            <Link to="/settings/privacy" className={buttonClass({ variant: 'outline' })}>
              Paramètres de confidentialité
            </Link>
          }
        >
          {me?.is_private
            ? 'Votre compte est privé : quand quelqu’un demandera à vous suivre, sa demande apparaîtra ici et dans vos notifications.'
            : 'Votre compte est public : on peut vous suivre sans demande.'}
        </EmptyState>
      )}
    </>
  );
}
