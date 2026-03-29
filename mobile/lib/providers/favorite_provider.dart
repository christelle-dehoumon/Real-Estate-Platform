import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/property_model.dart';
import 'property_provider.dart';

final favoritesProvider =
    AsyncNotifierProvider<FavoriteNotifier, List<PropertyModel>>(
  FavoriteNotifier.new,
);

class FavoriteNotifier extends AsyncNotifier<List<PropertyModel>> {
  @override
  Future<List<PropertyModel>> build() async {
    return _fetchFavorites();
  }

  Future<List<PropertyModel>> _fetchFavorites() async {
    final apiService = ref.read(apiServiceProvider);
    final response = await apiService.get('/favorites');
    final dynamic raw = response.data;
    if (raw == null || raw is! List) return const [];
    return raw.map((item) => PropertyModel.fromJson(item['property']))
        .toList();
  }

  Future<void> fetchFavorites() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(_fetchFavorites);
  }

  Future<bool> toggleFavorite(String propertyId) async {
    try {
      final apiService = ref.read(apiServiceProvider);
      final response = await apiService.post(
        '/favorites/toggle',
        data: {'propertyId': propertyId},
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        await fetchFavorites();
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  bool isFavorite(String propertyId) {
    return state.maybeWhen(
      data: (list) => list.any((p) => p.id == propertyId),
      orElse: () => false,
    );
  }
}
