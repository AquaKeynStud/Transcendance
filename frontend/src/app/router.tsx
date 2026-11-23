import { createBrowserRouter, Navigate } from 'react-router';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { RootLayout, type RouteHandle } from '@/app/layouts/RootLayout';
import { FeedPage } from '@/features/feed/FeedPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { AccountSettings } from '@/features/settings/AccountSettings';
import { PrivacySettings, SecuritySettings } from '@/features/settings/PrivacySecuritySettings';
import { ProfileSettings } from '@/features/settings/ProfileSettings';
import { SettingsLayout } from '@/features/settings/SettingsLayout';
import { ListsPage } from '@/features/social/ListsPage';
import { RequestsPage } from '@/features/social/RequestsPage';
import { DesignSystem } from '@/pages/DesignSystem';
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
      {
        index: true,
        element: <FeedPage kind="following" />,
        handle: { rail: 'composer' } satisfies RouteHandle,
      },
      {
        path: 'explore',
        element: <FeedPage kind="explore" />,
        handle: { rail: 'composer' } satisfies RouteHandle,
      },
      {
        path: 'posts/:postId',
        element: <Placeholder title="Fil de discussion" spec="POST-03, POST-04" sprint="S5" />,
      },
      {
        path: 'u/:username',
        children: [
          { index: true, element: <ProfilePage key="posts" /> },
          { path: 'replies', element: <ProfilePage key="replies" tab="replies" /> },
          { path: 'media', element: <ProfilePage key="media" tab="media" /> },
          { path: 'likes', element: <ProfilePage key="likes" tab="likes" /> },
          { path: 'reposts', element: <ProfilePage key="reposts" tab="reposts" /> },
          { path: 'followers', element: <ListsPage kind="followers" /> },
          { path: 'following', element: <ListsPage kind="following" /> },
          { path: 'friends', element: <ListsPage kind="friends" /> },
        ],
      },
      { path: 'requests', element: <RequestsPage /> },
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
        element: <SettingsLayout />,
        handle: { wide: true } satisfies RouteHandle,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: 'profile', element: <ProfileSettings /> },
          { path: 'account', element: <AccountSettings /> },
          { path: 'privacy', element: <PrivacySettings /> },
          { path: 'security', element: <SecuritySettings /> },
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
      { path: 'design-system', element: <DesignSystem /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
