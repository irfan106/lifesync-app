import React from 'react';
import { useFormikContext } from 'formik';
import { Typography } from '@design-system/Typography';
import { useTheme } from '@context/ThemeContext';
import { StyleSheet } from 'react-native';

export const FormError = ({ name }: { name: string }) => {
    const { errors, touched } = useFormikContext<any>();
    const theme = useTheme();
    
    const styles = StyleSheet.create({
      errorText: {
        color: theme.colors.error,
        fontSize: theme.fontSize.xs,
        marginTop: 4,
      },
    });
    
    if (!errors[name] || !touched[name]) return null;

    return <Typography style={styles.errorText}>{errors[name] as string}</Typography>;
}
