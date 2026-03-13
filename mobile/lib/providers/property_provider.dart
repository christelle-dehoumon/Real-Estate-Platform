import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/property_model.dart';
import '../services/api_service.dart';

final apiServiceProvider = Provider((ref) => ApiService());

final propertiesProvider = StateNotifierProvider<PropertyNotifier, AsyncValue<List<PropertyModel>>>((ref) {
  return PropertyNotifier(ref);
});

class PropertyNotifier extends StateNotifier<AsyncValue<List<PropertyModel>>> {
  final Ref _ref;

  PropertyNotifier(this._ref) : super(const AsyncValue.loading()) {
    fetchProperties();
  }

  Future<void> fetchProperties() async {
    state = const AsyncValue.loading();
    try {
      final apiService = _ref.read(apiServiceProvider);
      final response = await apiService.get('/properties');
      final dynamic raw = response.data;
      if (raw == null || raw is! List) {
        state = const AsyncValue.data([]);
        return;
      }
      state = AsyncValue.data((raw as List<dynamic>).map((item) => PropertyModel.fromJson(item)).toList());
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<bool> createProperty(Map<String, dynamic> propertyData) async {
    try {
      final apiService = _ref.read(apiServiceProvider);
      final response = await apiService.post('/properties', data: propertyData);
      if (response.statusCode == 201) {
        await fetchProperties();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}


final searchFilterProvider = StateProvider<Map<String, dynamic>>((ref) => {
  'city': '',
  'type': '',
  'minPrice': null,
  'maxPrice': null,
});

final filteredPropertiesProvider = Provider<AsyncValue<List<PropertyModel>>>((ref) {
  final propertiesAsync = ref.watch(propertiesProvider);
  final filters = ref.watch(searchFilterProvider);

  return propertiesAsync.whenData((properties) {
    return properties.where((p) {
      if (filters['city'] != '' && !p.location.city.toLowerCase().contains(filters['city'].toLowerCase())) return false;
      if (filters['type'] != '' && p.propertyType != filters['type']) return false;
      if (filters['minPrice'] != null && p.price < filters['minPrice']) return false;
      if (filters['maxPrice'] != null && p.price > filters['maxPrice']) return false;
      return true;
    }).toList();
  });
});
