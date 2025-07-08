import {
    AfterUpdate,
    AllowNull,
    AutoIncrement,
    BeforeUpdate,
    BelongsToMany,
    Column,
    CreatedAt,
    DataType,
    Default,
    DeletedAt,
    Model,
    PrimaryKey,
    Table,
    Unique,
    UpdatedAt,
} from 'sequelize-typescript';

import Role from './role.model';
import UserRole from './userRole.model';

@Table({
    tableName: 'users',
    timestamps: true,
    paranoid: true, // enable soft delete
})
class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id!: number;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING(20))
    username!: string;

    @AllowNull(false)
    @Column(DataType.STRING(150))
    password!: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING(100))
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING(20))
    firstname!: string;

    @AllowNull
    @Column(DataType.STRING(20))
    lastname ? : string;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    isEnabled!: boolean;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    isAccountNonExpired!: boolean;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    isAccountNonLocked!: boolean;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    isCredentialsNonExpired!: boolean;

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    isDeleted!: boolean;

    @Column(DataType.DATE)
    accountExpirationDate ? : Date;

    @Column(DataType.DATE)
    credentialsExpirationDate ? : Date;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        validate: {
            isIn: [
                ['SERVICE_ACCOUNT', 'USER_ACCOUNT']
            ],
        },
    })
    userType!: string;

    @Column(DataType.DATE)
    lastLogin ? : Date;

    @Column(DataType.BIGINT)
    createdBy ? : number;

    @CreatedAt
    @Column
    createdAt!: Date;

    @Column(DataType.BIGINT)
    updatedBy ? : number;

    @UpdatedAt
    @Column
    updatedAt!: Date;

    @Column(DataType.BIGINT)
    deletedBy ? : number;

    @DeletedAt
    @Column
    deletedAt ? : Date;

    // Many-to-Many relationship with Role through UserRole
    @BelongsToMany(() => Role, () => UserRole)
    roles ? : Role[];

    @BeforeUpdate
    static async onBeforeUpdate(instance: User) {
        console.log('BeforeUpdate hook triggered for User model');
        // Automatically set updatedBy to the current user's ID if available
        if (instance.changed('updatedBy') && !instance.updatedBy) {
            // Do something to get the current user's ID, e.g., from the request context
            // This is just a placeholder, replace with actual logic to get the current user ID
            // const currentUserId = 1; // Replace with actual logic to get the current user ID
            // instance.updatedBy = currentUserId;
        }
    }

    @AfterUpdate
    static async onAfterUpdate(instance: User) {
        console.log('AfterUpdate hook triggered for User model');
        // Automatically set updatedAt to the current timestamp
        // instance.updatedAt = new Date();
        // You can also perform additional actions here if needed
    }
}

export default User;