import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/property_model.dart';
import '../services/api_service.dart';

final apiServiceProvider = Provider((ref) => ApiService());

final propertiesProvider =
    AsyncNotifierProvider<PropertyNotifier, List<PropertyModel>>(
  PropertyNotifier.new,
);

class PropertyNotifier extends AsyncNotifier<List<PropertyModel>> {
  @override
  Future<List<PropertyModel>> build() async {
    return _fetchProperties();
  }

  Future<List<PropertyModel>> _fetchProperties() async {
    final apiService = ref.read(apiServiceProvider);
    final response = await apiService.get('/properties');
    final dynamic raw = response.data;
    if (raw == null || raw is! List) return const [];
    return (raw as List<dynamic>)
        .map((item) => PropertyModel.fromJson(item))
        .toList();
  }

  Future<void> fetchProperties() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(_fetchProperties);
  }

  Future<bool> createProperty(Map<String, dynamic> propertyData) async {
    try {
      final apiService = ref.read(apiServiceProvider);
      final response = await apiService.post(
        '/properties',
        data: propertyData,
      );
      if (response.statusCode == 201) {
        await fetchProperties();
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }
}

final searchFilterProvider =
    NotifierProvider<SearchFilterNotifier, Map<String, dynamic>>(
  SearchFilterNotifier.new,
);

class SearchFilterNotifier extends Notifier<Map<String, dynamic>> {
  @override
  Map<String, dynamic> build() => {
        'city': '',
        'type': '',
        'minPrice': null,
        'maxPrice': null,
      };

  void update(Map<String, dynamic> Function(Map<String, dynamic> state) cb) {
    state = cb(state);
  }
}

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
