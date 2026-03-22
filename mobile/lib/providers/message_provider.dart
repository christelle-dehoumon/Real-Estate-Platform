import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/message_model.dart';
import 'property_provider.dart';

class MessageState {
  final AsyncValue<List<MessageModel>> messages;
  final int unreadCount;

  MessageState({
    this.messages = const AsyncValue.loading(),
    this.unreadCount = 0,
  });

  MessageState copyWith({
    AsyncValue<List<MessageModel>>? messages,
    int? unreadCount,
  }) {
    return MessageState(
      messages: messages ?? this.messages,
      unreadCount: unreadCount ?? this.unreadCount,
    );
  }
}

final messagesProvider = NotifierProvider<MessageNotifier, MessageState>(
  MessageNotifier.new,
);

class MessageNotifier extends Notifier<MessageState> {
  @override
  MessageState build() {
    // IMPORTANT: state is not available until build returns.
    // Schedule async work after initialization to avoid "uninitialized provider".
    Future.microtask(() async {
      await fetchMessages();
      await fetchUnreadCount();
    });

    return MessageState();
  }

  Future<void> fetchMessages() async {
    if (state.messages is! AsyncData) {
      state = state.copyWith(messages: const AsyncValue.loading());
    }

    try {
      final apiService = ref.read(apiServiceProvider);
      final response = await apiService.get('/messages');
      final dynamic raw = response.data;
      if (raw == null || raw is! List) {
        state = state.copyWith(messages: const AsyncValue.data([]));
        return;
      }
      final messagesList = (raw as List<dynamic>)
          .map((item) => MessageModel.fromJson(item))
          .toList();

      state = state.copyWith(messages: AsyncValue.data(messagesList));
      await fetchUnreadCount();
    } catch (e, st) {
      state = state.copyWith(messages: AsyncValue.error(e, st));
    }
  }

  Future<void> fetchUnreadCount() async {
    try {
      final apiService = ref.read(apiServiceProvider);
      final response = await apiService.get('/messages/unread-count');
      final count = response.data['unreadCount'] ?? 0;
      state = state.copyWith(unreadCount: count);
    } catch (e) {
      // Silently fail
    }
  }

  Future<void> markConversationAsRead(String otherUserId) async {
    try {
      final apiService = ref.read(apiServiceProvider);
      await apiService.post(
        '/messages/mark-read',
        data: {'otherUserId': otherUserId},
      );
      await fetchMessages();
    } catch (e) {
      // Silently fail
    }
  }

  Future<bool> sendMessage(
    String receiverId,
    String content, {
    String? propertyId,
  }) async {
    try {
      final apiService = ref.read(apiServiceProvider);
      final response = await apiService.post(
        '/messages',
        data: {
          'receiverId': receiverId,
          'content': content,
          if (propertyId != null) 'propertyId': propertyId,
        },
      );
      if (response.statusCode == 201) {
        await fetchMessages();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

final chatProvider = FutureProvider.family<List<MessageModel>, String>((
  ref,
  otherUserId,
) async {
  final messageState = ref.watch(messagesProvider);
  return messageState.messages.maybeWhen(
    data: (list) => list
        .where((m) => m.senderId == otherUserId || m.receiverId == otherUserId)
        .toList(),
    orElse: () => [],
  );
});
