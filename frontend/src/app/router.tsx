import { createBrowserRouter, Navigate } from 'react-router';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { RootLayout } from '@/app/layouts/RootLayout';
import { NotFound } from '@/pages/NotFound';
import { Placeholder } from '@/pages/Placeholder';

// Écrans de docs/SPEC_FONC.md §7. Chaque Placeholder sera remplacé par la page de sa branche.
export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Placeholder title="Connexion" spec="AUTH-02" sprint="S2" /> },
      { path: 'signup', element: <Placeholder title="Inscription" spec="AUTH-01" sprint="S2" /> },
      {
        path: 'verify-email',
        element: <Placeholder title="Vérification de l’email" spec="AUTH-01" sprint="S2" />,
      },
      {
        path: 'forgot-password',
        element: <Placeholder title="Mot de passe oublié" spec="AUTH-04" sprint="S2" />,
      },
      {
        path: 'reset-password',
        element: <Placeholder title="Nouveau mot de passe" spec="AUTH-05" sprint="S2" />,
      },
    ],
  },
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Placeholder title="Fil Abonnements" spec="FEED-01" sprint="S4" /> },
      { path: 'explore', element: <Placeholder title="Fil Explorer" spec="FEED-02" sprint="S4" /> },
      {
        path: 'posts/:postId',
        element: <Placeholder title="Fil de discussion" spec="POST-03, POST-04" sprint="S5" />,
      },
      {
        path: 'u/:username',
        children: [
          {
            index: true,
            element: <Placeholder title="Profil" spec="ACC-01, ACC-02" sprint="S3" />,
          },
          { path: 'followers', element: <Placeholder title="Abonnés" spec="SOC-06" sprint="S3" /> },
          {
            path: 'following',
            element: <Placeholder title="Abonnements" spec="SOC-06" sprint="S3" />,
          },
          { path: 'friends', element: <Placeholder title="Amis" spec="SOC-06" sprint="S3" /> },
        ],
      },
      {
        path: 'requests',
        element: <Placeholder title="Demandes d’abonnement" spec="SOC-03 à 05" sprint="S3" />,
      },
      {
        path: 'messages/:conversationId?',
        element: <Placeholder title="Messages" spec="DM-01 à 05" sprint="S5" />,
      },
      {
        path: 'notifications',
        element: <Placeholder title="Notifications" spec="NOTIF-01, NOTIF-02" sprint="S6" />,
      },
      {
        path: 'search',
        element: <Placeholder title="Recherche" spec="SEARCH-01 à 05" sprint="S7" />,
      },
      {
        path: 'settings',
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          {
            path: 'profile',
            element: <Placeholder title="Paramètres · Profil" spec="ACC-03" sprint="S3" />,
          },
          {
            path: 'account',
            element: <Placeholder title="Paramètres · Compte" spec="ACC-04" sprint="S3" />,
          },
          {
            path: 'privacy',
            element: <Placeholder title="Paramètres · Confidentialité" spec="ACC-05" sprint="S3" />,
          },
          {
            path: 'security',
            element: <Placeholder title="Paramètres · Sécurité" spec="ACC-06" sprint="S3" />,
          },
          { path: 'data', element: <Placeholder title="Mes données" spec="ACC-08" sprint="S8" /> },
          {
            path: 'delete',
            element: <Placeholder title="Supprimer le compte" spec="ACC-09" sprint="S8" />,
          },
        ],
      },
      {
        path: 'admin',
        children: [
          { index: true, element: <Navigate to="users" replace /> },
          {
            path: 'users',
            element: <Placeholder title="Administration · Users" spec="ADM-01" sprint="S7" />,
          },
          {
            path: 'users/:username',
            element: (
              <Placeholder title="Administration · Fiche user" spec="ADM-02 à 07" sprint="S7" />
            ),
          },
          {
            path: 'log',
            element: <Placeholder title="Journal de modération" spec="ADM-08" sprint="S7" />,
          },
        ],
      },
      {
        path: 'privacy',
        element: <Placeholder title="Politique de confidentialité" spec="UI-01" sprint="S8" />,
      },
      {
        path: 'terms',
        element: <Placeholder title="Conditions d’utilisation" spec="UI-02" sprint="S8" />,
      },
      {
        path: 'design-system',
        element: <Placeholder title="Design system" spec="UI-07" sprint="S2" />,
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
