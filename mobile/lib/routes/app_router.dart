import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../screens/welcome_screen.dart';
import '../screens/login_screen.dart';
import '../screens/register_screen.dart';
import '../widgets/main_layout.dart';
import '../screens/search_screen.dart';
import '../screens/favorites_screen.dart';
import '../screens/publish_property_screen.dart';
import '../screens/message_list_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/property_details_screen.dart';
import '../screens/chat_screen.dart';
import '../providers/auth_provider.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorSearchKey = GlobalKey<NavigatorState>(
  debugLabel: 'search',
);
final _shellNavigatorFavoritesKey = GlobalKey<NavigatorState>(
  debugLabel: 'favorites',
);
final _shellNavigatorPublishKey = GlobalKey<NavigatorState>(
  debugLabel: 'publish',
);
final _shellNavigatorMessagesKey = GlobalKey<NavigatorState>(
  debugLabel: 'messages',
);
final _shellNavigatorProfileKey = GlobalKey<NavigatorState>(
  debugLabel: 'profile',
);

final goRouter = GoRouter(
  initialLocation: '/',
  navigatorKey: _rootNavigatorKey,
  routes: [
    GoRoute(path: '/', builder: (context, state) => const WelcomeScreen()),
    GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(
      path: '/property/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return PropertyDetailsScreen(propertyId: id);
      },
    ),
    GoRoute(
      path: '/chat/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return ChatScreen(otherUserId: id);
      },
    ),
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return MainLayout(navigationShell: navigationShell);
      },
      branches: [
        StatefulShellBranch(
          navigatorKey: _shellNavigatorSearchKey,
          routes: [
            GoRoute(
              path: '/search',
              builder: (context, state) => const SearchScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _shellNavigatorFavoritesKey,
          routes: [
            GoRoute(
              path: '/favorites',
              builder: (context, state) => const FavoritesScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _shellNavigatorPublishKey,
          routes: [
            GoRoute(
              path: '/publish',
              builder: (context, state) => const PublishPropertyScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _shellNavigatorMessagesKey,
          routes: [
            GoRoute(
              path: '/messages',
              builder: (context, state) => const MessageListScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _shellNavigatorProfileKey,
          routes: [
            GoRoute(
              path: '/profile',
              builder: (context, state) => const ProfileScreen(),
            ),
          ],
        ),
      ],
    ),
  ],
);
