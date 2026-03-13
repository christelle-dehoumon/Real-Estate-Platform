import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:real_estate_mobile/core/constants/app_colors.dart';
import 'package:real_estate_mobile/core/constants/app_spacing.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        brightness: Brightness.light,
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        tertiary: AppColors.accent,
        surface: AppColors.cardBg,
        surfaceDim: AppColors.background,
        onPrimary: AppColors.textOnPrimary,
        onSecondary: AppColors.textOnPrimary,
        onSurface: AppColors.textPrimary,
        outline: AppColors.border,
      ),
      scaffoldBackgroundColor: AppColors.background,
      dividerColor: AppColors.border,

      // ===== TYPOGRAPHY =====
      textTheme:
          GoogleFonts.poppinsTextTheme(
            TextTheme(
              // Display
              displayLarge: const TextStyle(
                fontSize: AppTypography.displayLarge,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
                letterSpacing: -0.5,
              ),
              displayMedium: const TextStyle(
                fontSize: AppTypography.displayMedium,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
                letterSpacing: -0.25,
              ),
              displaySmall: const TextStyle(
                fontSize: AppTypography.displaySmall,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),

              // Headline
              headlineLarge: const TextStyle(
                fontSize: AppTypography.headlineLarge,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
              headlineMedium: const TextStyle(
                fontSize: AppTypography.headlineMedium,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
              headlineSmall: const TextStyle(
                fontSize: AppTypography.headlineSmall,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),

              // Body
              bodyLarge: const TextStyle(
                fontSize: AppTypography.bodyLarge,
                fontWeight: FontWeight.w500,
                color: AppColors.textPrimary,
                letterSpacing: 0.5,
              ),
              bodyMedium: const TextStyle(
                fontSize: AppTypography.bodyMedium,
                fontWeight: FontWeight.w400,
                color: AppColors.textSecondary,
              ),
              bodySmall: const TextStyle(
                fontSize: AppTypography.bodySmall,
                fontWeight: FontWeight.w400,
                color: AppColors.textTertiary,
              ),

              // Label
              labelLarge: const TextStyle(
                fontSize: AppTypography.labelLarge,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
                letterSpacing: 0.5,
              ),
              labelMedium: const TextStyle(
                fontSize: AppTypography.labelMedium,
                fontWeight: FontWeight.w500,
                color: AppColors.textSecondary,
              ),
              labelSmall: const TextStyle(
                fontSize: AppTypography.labelSmall,
                fontWeight: FontWeight.w500,
                color: AppColors.textTertiary,
              ),
            ),
          ).apply(
            bodyColor: AppColors.textPrimary,
            displayColor: AppColors.textPrimary,
          ),

      // ===== APP BAR =====
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        centerTitle: false,
        scrolledUnderElevation: 2,
        titleTextStyle: GoogleFonts.poppins(
          fontSize: AppTypography.headlineMedium,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
          letterSpacing: -0.5,
        ),
        iconTheme: const IconThemeData(
          color: AppColors.textPrimary,
          size: AppSpacing.iconSize,
        ),
      ),

      // ===== BUTTONS =====
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.textOnPrimary,
          minimumSize: const Size(double.infinity, AppSpacing.buttonHeight),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusCircle),
          ),
          elevation: 0,
          textStyle: GoogleFonts.poppins(
            fontSize: AppTypography.labelLarge,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.2,
          ),
        ).copyWith(
          elevation: WidgetStateProperty.resolveWith<double>(
            (Set<WidgetState> states) {
              if (states.contains(WidgetState.pressed)) return 0;
              return 0; // Keeping it flat and modern
            },
          ),
        ),
      ),

      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.secondary,
          foregroundColor: AppColors.primary,
          minimumSize: const Size(double.infinity, AppSpacing.buttonHeight),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusCircle),
          ),
          textStyle: GoogleFonts.poppins(
            fontSize: AppTypography.labelLarge,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          minimumSize: const Size(double.infinity, AppSpacing.buttonHeight),
          side: const BorderSide(color: AppColors.primary, width: 1.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusCircle),
          ),
          textStyle: GoogleFonts.poppins(
            fontSize: AppTypography.labelLarge,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          ),
          textStyle: GoogleFonts.poppins(
            fontSize: AppTypography.labelLarge,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      // ===== INPUT FIELDS =====
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.cardBg,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.xl,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(color: AppColors.error, width: 1),
        ),
        hintStyle: GoogleFonts.poppins(
          color: AppColors.textTertiary,
          fontSize: AppTypography.bodyMedium,
        ),
      ),

      // ===== CARDS =====
      cardTheme: CardThemeData(
        color: AppColors.cardBg,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLarge),
          side: const BorderSide(color: AppColors.border, width: 1),
        ),
        clipBehavior: Clip.antiAlias,
      ),

      // ===== CHIPS =====
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.mutedLight,
        selectedColor: AppColors.primary,
        labelStyle: GoogleFonts.poppins(
          color: AppColors.textPrimary,
          fontSize: AppTypography.labelMedium,
          fontWeight: FontWeight.w500,
        ),
        secondaryLabelStyle: GoogleFonts.poppins(
          color: AppColors.textOnPrimary,
          fontSize: AppTypography.labelMedium,
          fontWeight: FontWeight.w500,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusCircle),
        ),
        side: BorderSide.none,
      ),

      // ===== BOTTOM SHEET =====
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.cardBg,
        elevation: 10,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(AppSpacing.radiusXL),
            topRight: Radius.circular(AppSpacing.radiusXL),
          ),
        ),
      ),

      // ===== DIALOG =====
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.cardBg,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusXL),
        ),
        titleTextStyle: GoogleFonts.poppins(
          fontSize: AppTypography.headlineMedium,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
      ),

      // ===== SNACKBAR =====
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.primary,
        contentTextStyle: GoogleFonts.poppins(
          color: AppColors.textOnPrimary,
          fontSize: AppTypography.bodyMedium,
          fontWeight: FontWeight.w500,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
        ),
        behavior: SnackBarBehavior.floating,
      ),

      // ===== PROGRESS INDICATOR =====
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.primary,
        linearMinHeight: 4,
        circularTrackColor: AppColors.borderLight,
      ),
    );
  }
}
