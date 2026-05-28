import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';
import { BaseModelDto, BaseModelNoUpadteDto } from './base.model';

/**
 * Абстрактный базовый класс для всех сущностей системы.
 * Обеспечивает наличие внутреннего числового ID для производительности
 * и публичного UUID для безопасности API[cite: 38].
 */
export abstract class BaseEntityNoUpdate implements BaseModelNoUpadteDto {
  /**
   * Внутренний первичный ключ (используется для связей и индексов в БД)
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Публичный уникальный идентификатор.
   * Только это поле должно передаваться наружу во внешних API[cite: 65, 48].
   */
  @Generated('uuid')
  @Column({ type: 'uuid', unique: true })
  uuid!: string;

  /**
   * Дата и время создания записи
   */
  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: string;
}

/**
 * Абстрактный базовый класс для всех сущностей системы с колонкой UpdatedAt
 * Обеспечивает наличие внутреннего числового ID для производительности
 * и публичного UUID для безопасности API[cite: 38].
 */
export abstract class BaseEntity extends BaseEntityNoUpdate implements BaseModelDto {
  /**
   * Дата и время последнего обновления записи
   */
  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: string;
}
