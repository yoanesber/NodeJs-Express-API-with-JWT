import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';

import Role from './role.model';
import User from './user.model';

@Table({
    tableName: 'user_roles',
    timestamps: false
})
class UserRole extends Model {
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    userId!: number;

    @ForeignKey(() => Role)
    @Column(DataType.INTEGER)
    roleId!: number;
}

export default UserRole;