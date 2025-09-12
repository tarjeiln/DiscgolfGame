import styles from './FormFieldGroup.module.css';
import type { InputHTMLAttributes, HTMLInputTypeAttribute, ReactNode } from 'react';

type FieldConfig = {
  id?: string;                          // hvis ikke satt, blir generert fra base-id + index
  subLabel?: string;                    // liten tekst over input (f.eks. "Fra", "Til")
  value: string | number;
  onChange: (value: string) => void;    // parse til tall der du bruker den om ønskelig
  type?: HTMLInputTypeAttribute;        // 'text' | 'number' | ...
  placeholder?: string;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'type' | 'id'
  >;
};

type Props = {
  id: string;                           // base-id for gruppa
  label: string;                        // felles label (legend)
  fields: FieldConfig[];                // 2, 3, 4 ... så mange du vil
  columns?: number;                     // antall kolonner i grid, default = 2
  hint?: string;
  error?: string;
  right?: ReactNode;                    // valgfritt: element på høyre side av label (knapp, etc.)
};

export default function FormFieldGroup({
  id, label, fields, columns = 2, hint, error, right
}: Props) {
  return (
    <fieldset className={styles.field} aria-invalid={!!error}>
      <div className={styles.top}>
        <legend className={styles.legend}>{label}</legend>
        {right}
      </div>

      <div className={styles.inputs} style={{ ['--cols' as any]: columns }}>
        {fields.map((f, idx) => {
          const inputId = f.id ?? `${id}-${idx}`;
          return (
            <div key={inputId} className={styles.inputWrap}>
              {f.subLabel && <label htmlFor={inputId} className={styles.sub}>{f.subLabel}</label>}
              <input
                id={inputId}
                className={styles.input}
                type={f.type ?? 'text'}
                value={f.value}
                placeholder={f.placeholder}
                onChange={(e) => f.onChange(e.target.value)}
                {...(f.inputProps ?? {})}
              />
            </div>
          );
        })}
      </div>

      {hint && !error && <div className={styles.hint}>{hint}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </fieldset>
  );
}
