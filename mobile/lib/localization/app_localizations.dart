import 'package:flutter/material.dart';

class AppLocalizations {
  final Locale locale;
  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const _localizedValues = {
    'en': {
      'welcome': 'Welcome to Fasohabitat',
      'login': 'Login',
      'signup': 'Sign Up',
      'email': 'Email',
      'password': 'Password',
      'search': 'Search Properties',
      // Add more strings as needed
    },
    'fr': {
      'welcome': 'Bienvenue sur Fasohabitat',
      'login': 'Connexion',
      'signup': 'S\'inscrire',
      'email': 'E-mail',
      'password': 'Mot de passe',
      'search': 'Rechercher des propriétés',
      // Add more strings as needed
    },
  };

  String get welcome => _localizedValues[locale.languageCode]!['welcome']!;
  String get login => _localizedValues[locale.languageCode]!['login']!;
  String get signup => _localizedValues[locale.languageCode]!['signup']!;
  String get email => _localizedValues[locale.languageCode]!['email']!;
  String get password => _localizedValues[locale.languageCode]!['password']!;
  String get search => _localizedValues[locale.languageCode]!['search']!;
}

class AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['en', 'fr'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(AppLocalizationsDelegate old) => false;
}
