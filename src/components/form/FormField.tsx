import styles from './FormField.module.css';
import type { InputHTMLAttributes, HTMLInputTypeAttribute } from 'react';

type Props = {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;   // du får ren string tilbake
  type?: HTMLInputTypeAttribute;       // 'text' | 'number' | ...
  hint?: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'id'>;

export default function FormField({
  id, label, value, onChange, type = 'text', hint, error, ...rest
}: Props) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input
        id={id}
        className={styles.input}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={hint && !error ? `${id}-hint` : (error ? `${id}-error` : undefined)}
        {...rest}
      />
      {hint && !error && <div id={`${id}-hint`} className={styles.hint}>{hint}</div>}
      {error && <div id={`${id}-error`} className={styles.error}>{error}</div>}
    </div>
  );
}
