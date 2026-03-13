import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_spacing.dart';

/// Premium Custom Button with animation
class PremiumButton extends StatefulWidget {
  final String label;
  final VoidCallback onPressed;
  final bool isLoading;
  final IconData? icon;
  final bool isExpanded;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final VoidCallback? onLongPress;
  final Duration animationDuration;

  const PremiumButton({
    Key? key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.isExpanded = true,
    this.backgroundColor,
    this.foregroundColor,
    this.onLongPress,
    this.animationDuration = const Duration(milliseconds: 300),
  }) : super(key: key);

  @override
  State<PremiumButton> createState() => _PremiumButtonState();
}

class _PremiumButtonState extends State<PremiumButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: widget.animationDuration,
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    _animationController.forward();
  }

  void _onTapUp(TapUpDetails details) {
    _animationController.reverse();
  }

  void _onTapCancel() {
    _animationController.reverse();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      onTap: widget.isLoading ? null : widget.onPressed,
      onLongPress: widget.isLoading ? null : widget.onLongPress,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          width: widget.isExpanded ? double.infinity : null,
          height: AppSpacing.buttonHeight,
          decoration: BoxDecoration(
            gradient: AppColors.primaryGradient,
            borderRadius: BorderRadius.circular(AppSpacing.radiusLarge),
            boxShadow: AppColors.elevatedShadow,
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: widget.isLoading ? null : widget.onPressed,
              borderRadius: BorderRadius.circular(AppSpacing.radiusLarge),
              child: Center(
                child: widget.isLoading
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            Colors.white,
                          ),
                        ),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (widget.icon != null) ...[
                            Icon(widget.icon, color: Colors.white),
                            const SizedBox(width: AppSpacing.md),
                          ],
                          Text(
                            widget.label,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Premium Secondary Button
class SecondaryButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final IconData? icon;
  final bool isExpanded;
  final Color? borderColor;
  final Color? textColor;

  const SecondaryButton({
    Key? key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.isExpanded = true,
    this.borderColor,
    this.textColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: isExpanded ? double.infinity : null,
      height: AppSpacing.buttonHeight,
      decoration: BoxDecoration(
        border: Border.all(color: borderColor ?? AppColors.primary, width: 1.5),
        borderRadius: BorderRadius.circular(AppSpacing.radiusLarge),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(AppSpacing.radiusLarge),
          child: Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (icon != null) ...[
                  Icon(icon, color: textColor ?? AppColors.primary),
                  const SizedBox(width: AppSpacing.md),
                ],
                Text(
                  label,
                  style: TextStyle(
                    color: textColor ?? AppColors.primary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Premium Card with shadow and animation
class PremiumCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsets padding;
  final BorderRadius? borderRadius;
  final bool enableHover;
  final Duration animationDuration;

  const PremiumCard({
    Key? key,
    required this.child,
    this.onTap,
    this.padding = const EdgeInsets.all(AppSpacing.lg),
    this.borderRadius,
    this.enableHover = true,
    this.animationDuration = const Duration(milliseconds: 300),
  }) : super(key: key);

  @override
  State<PremiumCard> createState() => _PremiumCardState();
}

class _PremiumCardState extends State<PremiumCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _elevationAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: widget.animationDuration,
      vsync: this,
    );
    _elevationAnimation = Tween<double>(begin: 0, end: 8).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: widget.enableHover
          ? (_) => _animationController.forward()
          : null,
      onExit: widget.enableHover ? (_) => _animationController.reverse() : null,
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedBuilder(
          animation: _elevationAnimation,
          builder: (context, child) {
            return Container(
              decoration: BoxDecoration(
                color: AppColors.cardBg,
                borderRadius:
                    widget.borderRadius ??
                    BorderRadius.circular(AppSpacing.radiusLarge),
                border: Border.all(color: AppColors.border, width: 1),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.08),
                    blurRadius: _elevationAnimation.value * 2,
                    offset: Offset(0, _elevationAnimation.value),
                  ),
                ],
              ),
              child: Padding(padding: widget.padding, child: widget.child),
            );
          },
        ),
      ),
    );
  }
}

/// Badge component for displaying tags
class PremiumBadge extends StatelessWidget {
  final String label;
  final Color? backgroundColor;
  final Color? textColor;
  final IconData? icon;
  final VoidCallback? onDelete;

  const PremiumBadge({
    Key? key,
    required this.label,
    this.backgroundColor,
    this.textColor,
    this.icon,
    this.onDelete,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.lg,
        vertical: AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.primaryLight,
        borderRadius: BorderRadius.circular(AppSpacing.radiusCircle),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 14, color: textColor ?? AppColors.primary),
            const SizedBox(width: AppSpacing.sm),
          ],
          Text(
            label,
            style: TextStyle(
              color: textColor ?? AppColors.primary,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          if (onDelete != null) ...[
            const SizedBox(width: AppSpacing.sm),
            GestureDetector(
              onTap: onDelete,
              child: Icon(
                Icons.close,
                size: 14,
                color: textColor ?? AppColors.primary,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Loading skeleton for premium look
class SkeletonLoader extends StatefulWidget {
  final double height;
  final double? width;
  final BorderRadius? borderRadius;

  const SkeletonLoader({
    Key? key,
    required this.height,
    this.width,
    this.borderRadius,
  }) : super(key: key);

  @override
  State<SkeletonLoader> createState() => _SkeletonLoaderState();
}

class _SkeletonLoaderState extends State<SkeletonLoader>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: widget.height,
      width: widget.width,
      decoration: BoxDecoration(
        color: AppColors.borderLight,
        borderRadius:
            widget.borderRadius ??
            BorderRadius.circular(AppSpacing.radiusLarge),
      ),
      child: Stack(
        children: [
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: const Alignment(-1, -1),
                end: const Alignment(1, 1),
                colors: [
                  AppColors.borderLight,
                  AppColors.border,
                  AppColors.borderLight,
                ],
              ),
              borderRadius:
                  widget.borderRadius ??
                  BorderRadius.circular(AppSpacing.radiusLarge),
            ),
          ),
          Positioned.fill(
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(-1, 0),
                end: const Offset(1, 0),
              ).animate(_animationController),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.white.withOpacity(0),
                      Colors.white.withOpacity(0.3),
                      Colors.white.withOpacity(0),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
