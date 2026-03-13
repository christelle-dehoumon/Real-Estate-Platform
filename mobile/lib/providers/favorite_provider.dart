import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/property_model.dart';
import 'property_provider.dart';

final favoritesProvider = StateNotifierProvider<FavoriteNotifier, AsyncValue<List<PropertyModel>>>((ref) {
  return FavoriteNotifier(ref);
});

class FavoriteNotifier extends StateNotifier<AsyncValue<List<PropertyModel>>> {
  final Ref _ref;

  FavoriteNotifier(this._ref) : super(const AsyncValue.loading()) {
    fetchFavorites();
  }

  Future<void> fetchFavorites() async {
    state = const AsyncValue.loading();
    try {
      final apiService = _ref.read(apiServiceProvider);
      final response = await apiService.get('/favorites');
      final List<dynamic> data = response.data;
      state = AsyncValue.data(data.map((item) => PropertyModel.fromJson(item['property'])).toList());
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<bool> toggleFavorite(String propertyId) async {
    try {
      final apiService = _ref.read(apiServiceProvider);
      final response = await apiService.post('/favorites/toggle', data: {'propertyId': propertyId});
      if (response.statusCode == 200 || response.statusCode == 201) {
        await fetchFavorites();
        return true;
      }
      return false;
    } catch (e) {
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
