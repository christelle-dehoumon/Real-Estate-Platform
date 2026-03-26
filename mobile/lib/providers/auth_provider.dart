import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import 'property_provider.dart';

class AuthState {
  final bool loading;
  final UserModel? user;
  final String? error;

  AuthState({this.loading = false, this.user, this.error});

  bool get isLoading => loading;

  AuthState copyWith({bool? loading, UserModel? user, String? error}) {
    return AuthState(
      loading: loading ?? this.loading,
      user: user ?? this.user,
      error: error ?? this.error,
    );
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(
  AuthNotifier.new,
);

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() => AuthState();

  Future<bool> login(String email, String password) async {
    state = state.copyWith(loading: true, error: null, user: state.user);
    try {
      // TODO: Wire real backend auth. For now, keep the app runnable.
      await Future.delayed(const Duration(milliseconds: 200));
      state = state.copyWith(
        loading: false,
        user: UserModel(
          id: 'demo-id',
          name: email.split('@').first,
          email: email,
          phone: null,
          photoUrl: null,
          role: UserRole.buyer,
          isEmailVerified: true,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      );
      return true;
    } catch (e) {
      state = state.copyWith(loading: false, error: e.toString(), user: state.user);
      return false;
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String password,
    String? phone,
    String role = 'buyer',
  }) async {
    state = state.copyWith(loading: true, error: null, user: state.user);
    try {
      // TODO: Wire real backend register. For now, keep the app runnable.
      await Future.delayed(const Duration(milliseconds: 200));
      state = state.copyWith(
        loading: false,
        user: UserModel(
          id: 'demo-id',
          name: name,
          email: email,
          phone: phone,
          photoUrl: null,
          role: switch (role) {
            'owner' => UserRole.owner,
            'admin' => UserRole.admin,
            _ => UserRole.buyer,
          },
          isEmailVerified: false,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      );
      return true;
    } catch (e) {
      state = state.copyWith(loading: false, error: e.toString(), user: state.user);
      return false;
    }
  }

  void logout() {
    state = AuthState();
  }

  Future<bool> changePassword(String oldPassword, String newPassword) async {
    try {
      final api = ref.read(apiServiceProvider);
      final res = await api.post(
        '/users/change-password',
        data: {'oldPassword': oldPassword, 'newPassword': newPassword},
      );
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  Future<bool> uploadProfilePhoto(String imagePath) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final success = await _authService.uploadProfilePhoto(imagePath);
      if (success) {
        final user = await _authService.getProfile();
        state = state.copyWith(user: user, isLoading: false);
      } else {
        state = state.copyWith(isLoading: false, error: 'Upload failed');
      }
      return success;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  Future<bool> deleteAccount() async {
    try {
      final api = ref.read(apiServiceProvider);
      final res = await api.delete('/users/me');
      if (res.statusCode == 200 || res.statusCode == 204) {
        logout();
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }
}
