/**
 * Переопределение обязательности/опциональности полей
 */

// Все поля, кроме указанных
export type OmitDto<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Сделать некоторые поля опциональными
export type PartialDto<T> = {
  [P in keyof T]?: T[P];
};

// Сделать некоторые поля обязательными
export type RequiredDto<T> = {
  [P in keyof T]-?: T[P];
};

// Кастомный утилит для переопределения обязательности
export type OverrideOptionalDto<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P];
};

export type OverrideRequiredDto<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P];
};
