export interface IResourceResolver {
  /** * Принимает внешний UUID, возвращает внутренний числовой ID.
   * Если не найдено — выбрасывает EntityNotFoundException.
   */
  resolveInternalId(uuid: string): Promise<number | null>;
}
