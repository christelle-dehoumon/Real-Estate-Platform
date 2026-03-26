import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/message_provider.dart';
import '../providers/auth_provider.dart';
import '../models/message_model.dart';
import '../core/constants/app_colors.dart';
import 'package:intl/intl.dart';

class MessageListScreen extends ConsumerWidget {
  const MessageListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final messagesAsync = ref.watch(messagesProvider);
    final authState = ref.watch(authProvider);
    final currentUserId = authState.user?.id ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Messages',
          style: TextStyle(
            color: AppColors.foreground,
            fontWeight: FontWeight.bold,
            fontFamily: 'Poppins',
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: messagesAsync.messages.when(
        data: (messages) {
          final conversations = _groupMessages(messages, currentUserId);

          if (conversations.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.05),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.chat_bubble_outline,
                      size: 64,
                      color: AppColors.muted,
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Aucun message',
                    style: TextStyle(
                      fontSize: 18,
                      color: AppColors.foreground,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Poppins',
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Vos conversations apparaîtront ici',
                    style: TextStyle(fontSize: 14, color: AppColors.muted),
                  ),
                ],
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: conversations.length,
            separatorBuilder: (context, index) =>
                const Divider(color: AppColors.border, height: 1),
            itemBuilder: (context, index) {
              final conversation = conversations[index];
              return ListTile(
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 8,
                ),
                leading: CircleAvatar(
                  radius: 28,
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  child: const Icon(
                    Icons.person,
                    color: AppColors.primary,
                    size: 28,
                  ),
                ),
                title: Text(
                  'Utilisateur ${conversation.participantId.substring(0, 8)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppColors.foreground,
                    fontFamily: 'Poppins',
                  ),
                ),
                subtitle: Padding(
                  padding: const EdgeInsets.only(top: 4.0),
                  child: Text(
                    conversation.lastMessage.content,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: AppColors.muted),
                  ),
                ),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      DateFormat.Hm().format(
                        conversation.lastMessage.createdAt,
                      ),
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.muted,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                onTap: () =>
                    context.push('/chat/${conversation.participantId}'),
              );
            },
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (error, _) => Center(
          child: Text(
            'Erreur: $error',
            style: const TextStyle(color: Colors.red),
          ),
        ),
      ),
    );
  }

  List<ConversationSummary> _groupMessages(
    List<MessageModel> messages,
    String currentUserId,
  ) {
    final Map<String, MessageModel> lastMessages = {};

    for (final m in messages) {
      final otherId = m.senderId == currentUserId ? m.receiverId : m.senderId;
      if (!lastMessages.containsKey(otherId) ||
          m.createdAt.isAfter(lastMessages[otherId]!.createdAt)) {
        lastMessages[otherId] = m;
      }
    }

    return lastMessages.entries
        .map(
          (e) =>
              ConversationSummary(participantId: e.key, lastMessage: e.value),
        )
        .toList()
      ..sort(
        (a, b) => b.lastMessage.createdAt.compareTo(a.lastMessage.createdAt),
      );
  }
}

class ConversationSummary {
  final String participantId;
  final MessageModel lastMessage;

  ConversationSummary({required this.participantId, required this.lastMessage});
}
