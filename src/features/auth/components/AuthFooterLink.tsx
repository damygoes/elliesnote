import { Colors, Fonts } from '@/shared/constants/theme';
import { Href, Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AuthFooterLinkProps {
  text: string;
  linkText: string;
  href: Href;
}

export function AuthFooterLink({ text, linkText, href }: AuthFooterLinkProps) {
  return (
    <View style={styles.footerRow}>
      <Text style={styles.footerText}>{text}</Text>
      <Link href={href} asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.footerLink}>{linkText}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  footerText: {
    fontSize: 13,
    color: Colors.light.text_muted,
    fontFamily: Fonts?.sans,
  },
  footerLink: {
    fontSize: 13,
    color: Colors.light.primary,
    fontFamily: Fonts?.sans,
    textDecorationLine: 'underline',
  },
});
