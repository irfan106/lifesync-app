import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@design-system/TextInput';
import { Button } from '@design-system/Button';
import { Container } from '@design-system/Container';
import { useTheme } from '@context/ThemeContext';
import { useAddExpense } from '@controllers/expense.controller';

const ExpenseSchema = Yup.object().shape({
  amount: Yup.number().required('Amount is required').positive('Must be positive'),
  category: Yup.string().required('Category is required'),
  note: Yup.string(),
});

interface ExpenseFormValues {
    amount: string;
    category: string;
    note: string;
}

export const ExpenseForm = () => {
  const theme = useTheme();
  const addExpenseConfig = useAddExpense();

  const styles = StyleSheet.create({
    form: {
      gap: theme.spacing.sm,
    },
  });

  const handleSubmit = (values: ExpenseFormValues, { resetForm }: any) => {
      addExpenseConfig.mutate({
          amount: parseFloat(values.amount),
          category: values.category,
          note: values.note,
          date: new Date().toISOString()
      }, {
          onSuccess: () => resetForm(),
      });
  };

  return (
    <Container padding={false}>
      <Formik
        initialValues={{ amount: '', category: '', note: '' }}
        validationSchema={ExpenseSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              label="Amount"
              placeholder="0.00"
              keyboardType="numeric"
              onChangeText={handleChange('amount')}
              onBlur={handleBlur('amount')}
              value={values.amount}
              error={touched.amount && errors.amount ? errors.amount : undefined}
            />
            
            <TextInput
              label="Category"
              placeholder="e.g., Food, Travel"
              onChangeText={handleChange('category')}
              onBlur={handleBlur('category')}
              value={values.category}
              error={touched.category && errors.category ? errors.category : undefined}
            />

            <TextInput
              label="Note (Optional)"
              placeholder="Description..."
              onChangeText={handleChange('note')}
              onBlur={handleBlur('note')}
              value={values.note}
            />

            <Button 
                title="Add Expense" 
                onPress={() => handleSubmit()} 
                loading={addExpenseConfig.isPending}
                style={{ marginTop: 8 }}
            />
          </View>
        )}
      </Formik>
    </Container>
  );
};
