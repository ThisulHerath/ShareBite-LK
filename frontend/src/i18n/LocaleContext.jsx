/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const copy = {
  en: {
    home: 'Home', about: 'About', findFood: 'Find food', shareFood: 'Share food', dashboard: 'Dashboard',
    login: 'Log in', logout: 'Log out', changePassword: 'Change password', deleteAccount: 'Delete account',
    donor: 'Food donor', recipient: 'Food recipient', admin: 'Administrator', language: 'Language',
    heroKicker: 'Sri Lanka’s community food network',
    heroTitle: 'Share more. Waste less. Feed communities.',
    heroText: 'ShareBite LK connects safe surplus food from local businesses and households with people and community organisations nearby.',
    findNearby: 'Find food nearby', postSurplus: 'Post surplus food',
    liveListings: 'Live local listings', liveText: 'See what is available now, with clear quantities and pickup deadlines.',
    safeSharing: 'Safer sharing', safeText: 'Donors add collection details while recipients reserve only what they need.',
    islandReady: 'Built for Sri Lanka', islandText: 'All 25 districts, Sri Lankan phone validation, and Sinhala support.',
    howWorks: 'How it works', howTitle: 'Good food reaches the right hands in three simple steps.',
    step1: 'List safely', step1Text: 'Verified donors describe the food, quantity, location, and collection deadline.',
    step2: 'Reserve nearby', step2Text: 'Recipients search by district and reserve an available number of portions.',
    step3: 'Collect on time', step3Text: 'Both sides coordinate directly and complete collection before the deadline.',
    roleTitle: 'A workspace designed around your role',
    donorText: 'Create and manage surplus listings from one simple dashboard.',
    recipientText: 'Discover food nearby, reserve portions, and manage collections.',
    adminText: 'Keep the marketplace safe and manage platform activity.',
    getStarted: 'Create free account', memberAlready: 'Already a member?',
    footerText: 'Helping good food go further across Sri Lanka.',
    availableToday: 'Available today', findTitle: 'Find food to collect',
    findSubtitle: 'Search safe surplus food near you and reserve only the portions you can collect.',
    accountType: 'Account type', district: 'District', fullName: 'Full name', email: 'Email address', password: 'Password',
    welcomeBack: 'Welcome back', createAccount: 'Create your account', authLoginText: 'Sign in to continue to your dashboard.',
    authRegisterText: 'Choose how you want to use ShareBite LK.', submitLogin: 'Log in securely', submitRegister: 'Create account',
    noPermissionTitle: 'This page is not available for your role', noPermissionText: 'Use your dashboard to access the actions available to your account.',
  },
  si: {
    home: 'මුල් පිටුව', about: 'අප ගැන', findFood: 'ආහාර සොයන්න', shareFood: 'ආහාර බෙදාගන්න', dashboard: 'පාලක පුවරුව',
    login: 'ඇතුළු වන්න', logout: 'පිටවන්න', changePassword: 'මුරපදය වෙනස් කරන්න', deleteAccount: 'ගිණුම මකන්න',
    donor: 'ආහාර දායකයා', recipient: 'ආහාර ලබන්නා', admin: 'පරිපාලක', language: 'භාෂාව',
    heroKicker: 'ශ්‍රී ලංකාවේ ප්‍රජා ආහාර ජාලය',
    heroTitle: 'වැඩිපුර බෙදාගන්න. නාස්තිය අඩු කරන්න. ප්‍රජාව පෝෂණය කරන්න.',
    heroText: 'ShareBite LK මඟින් ව්‍යාපාර සහ නිවෙස්වල ආරක්ෂිත අතිරික්ත ආහාර අවට පුද්ගලයින් හා ප්‍රජා සංවිධාන සමඟ සම්බන්ධ කරයි.',
    findNearby: 'අවට ආහාර සොයන්න', postSurplus: 'අතිරික්ත ආහාර පළ කරන්න',
    liveListings: 'සජීවී දේශීය දැන්වීම්', liveText: 'ලබා ගත හැකි ප්‍රමාණය සහ රැගෙන යාමේ අවසන් වේලාව පැහැදිලිව බලන්න.',
    safeSharing: 'ආරක්ෂිත බෙදාහැරීම', safeText: 'දායකයින් එකතු කිරීමේ තොරතුරු දක්වන අතර ලබන්නන් අවශ්‍ය ප්‍රමාණය පමණක් වෙන් කරයි.',
    islandReady: 'ශ්‍රී ලංකාව සඳහා', islandText: 'දිස්ත්‍රික්ක 25, දේශීය දුරකථන තහවුරු කිරීම සහ සිංහල සහාය.',
    howWorks: 'ක්‍රියා කරන ආකාරය', howTitle: 'සරල පියවර තුනකින් හොඳ ආහාර නිවැරදි අතට.',
    step1: 'ආරක්ෂිතව පළ කරන්න', step1Text: 'දායකයා ආහාර, ප්‍රමාණය, ස්ථානය සහ අවසන් වේලාව සඳහන් කරයි.',
    step2: 'අවටින් වෙන් කරන්න', step2Text: 'ලබන්නන් දිස්ත්‍රික්කය අනුව සොයා අවශ්‍ය ආහාර කොටස් වෙන් කරයි.',
    step3: 'වේලාවට ලබාගන්න', step3Text: 'දෙපාර්ශ්වය සෘජුව සම්බන්ධ වී අවසන් වේලාවට පෙර ආහාර ලබාගනී.',
    roleTitle: 'ඔබගේ භූමිකාවට ගැළපෙන සේවා අවකාශයක්',
    donorText: 'අතිරික්ත ආහාර දැන්වීම් එක් සරල පාලක පුවරුවකින් කළමනාකරණය කරන්න.',
    recipientText: 'අවට ආහාර සොයා කොටස් වෙන් කර එකතු කිරීම් කළමනාකරණය කරන්න.',
    adminText: 'වෙළඳපොළ ආරක්ෂිතව තබා වේදිකාවේ ක්‍රියාකාරකම් කළමනාකරණය කරන්න.',
    getStarted: 'නොමිලේ ගිණුමක් සාදන්න', memberAlready: 'දැනටමත් සාමාජිකයෙක්ද?',
    footerText: 'ශ්‍රී ලංකාව පුරා හොඳ ආහාර වැඩි දුරක් ගෙන යමු.',
    availableToday: 'අද ලබා ගත හැක', findTitle: 'ලබාගැනීමට ආහාර සොයන්න',
    findSubtitle: 'ඔබ අවට ආරක්ෂිත අතිරික්ත ආහාර සොයා ගෙන රැගෙන යා හැකි ප්‍රමාණය පමණක් වෙන් කරන්න.',
    accountType: 'ගිණුම් වර්ගය', district: 'දිස්ත්‍රික්කය', fullName: 'සම්පූර්ණ නම', email: 'විද්‍යුත් තැපෑල', password: 'මුරපදය',
    welcomeBack: 'නැවත සාදරයෙන් පිළිගනිමු', createAccount: 'ඔබේ ගිණුම සාදන්න', authLoginText: 'ඔබේ පාලක පුවරුවට යාමට ඇතුළු වන්න.',
    authRegisterText: 'ShareBite LK භාවිතා කිරීමට ඔබේ භූමිකාව තෝරන්න.', submitLogin: 'ආරක්ෂිතව ඇතුළු වන්න', submitRegister: 'ගිණුම සාදන්න',
    noPermissionTitle: 'මෙම පිටුව ඔබගේ භූමිකාවට ලබා ගත නොහැක', noPermissionText: 'ඔබගේ ගිණුමට ලබා දී ඇති ක්‍රියා සඳහා පාලක පුවරුව භාවිතා කරන්න.',
  },
}

const LocaleContext = createContext(null)

export function LocaleProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('sharebite-language') || 'en')
  useEffect(() => {
    localStorage.setItem('sharebite-language', language)
    document.documentElement.lang = language === 'si' ? 'si' : 'en'
  }, [language])
  const value = useMemo(() => ({ language, setLanguage, t: (key) => copy[language]?.[key] || copy.en[key] || key }), [language])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}
