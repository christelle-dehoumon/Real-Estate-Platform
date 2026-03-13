import 'package:flutter/material.dart';

class AppColors {
  // Primary Brand Colors - Royal Midnight
  static const Color primary = Color(0xFF0F172A); // Midnight Blue
  static const Color primaryLight = Color(0xFF1E293B); 
  static const Color primaryDark = Color(0xFF020617); 

  // Secondary - Gold/Brass for an elegant accent
  static const Color secondary = Color(0xFFD4AF37); // Metallic Gold
  static const Color secondaryLight = Color(0xFFF1E4C1);
  static const Color secondaryDark = Color(0xFF996515);

  // Accent - Sophisticated Slate/Indigo
  static const Color accent = Color(0xFF6366F1); // Indigo
  static const Color accentLight = Color(0xFFEEF2FF);
  static const Color accentDark = Color(0xFF4338CA);

  // Success State
  static const Color success = Color(0xFF10B981); // Emerald
  static const Color successLight = Color(0xFFD1FAE5);
  static const Color successDark = Color(0xFF047857);

  // Warning State
  static const Color warning = Color(0xFFF59E0B); // Amber
  static const Color warningLight = Color(0xFFFEF3C7);
  static const Color warningDark = Color(0xFFB45309);

  // Error State
  static const Color error = Color(0xFFEF4444); // Red
  static const Color errorLight = Color(0xFFFEE2E2);
  static const Color errorDark = Color(0xFFB91C1C);

  // Neutral/Grayscale - Premium grays
  static const Color background = Color(0xFFF8FAFC); // Slate 50
  static const Color foreground = Color(0xFF0F172A); // Slate 900

  static const Color cardBg = Color(0xFFFFFFFF); // Pure white
  static const Color muted = Color(0xFF64748B); // Slate 500
  static const Color mutedLight = Color(0xFFF1F5F9); // Slate 100
  static const Color border = Color(0xFFE2E8F0); // Slate 200
  static const Color borderLight = Color(0xFFF1F5F9); // Slate 100

  static const Color greyLight = Color(0xFFF8FAFC); // Slate 50
  static const Color greyDark = Color(0xFF334155); // Slate 700

  // Text Colors
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF475569);
  static const Color textTertiary = Color(0xFF94A3B8);
  static const Color textOnPrimary = Color(0xFFFFFFFF);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient accentGradient = LinearGradient(
    colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient gradientText = LinearGradient(
    colors: [Color(0xFF0F172A), Color(0xFFD4AF37)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient premiumGradient = LinearGradient(
    colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF334155)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Shadows
  static const List<BoxShadow> shadowSmall = [
    BoxShadow(color: Color(0x08000000), blurRadius: 4, offset: Offset(0, 1)),
  ];

  static const List<BoxShadow> shadowMedium = [
    BoxShadow(color: Color(0x0A000000), blurRadius: 8, offset: Offset(0, 2)),
  ];

  static const List<BoxShadow> shadowLarge = [
    BoxShadow(color: Color(0x0F000000), blurRadius: 16, offset: Offset(0, 4)),
  ];

  static const List<BoxShadow> shadowXL = [
    BoxShadow(color: Color(0x14000000), blurRadius: 24, offset: Offset(0, 8)),
  ];

  static const List<BoxShadow> elevatedShadow = [
    BoxShadow(color: Color(0x1A5B4EE8), blurRadius: 20, offset: Offset(0, 10)),
  ];
}
