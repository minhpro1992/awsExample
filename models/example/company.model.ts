
import { Model, Table, Column, DataType } from 'sequelize-typescript'

@Table({
    tableName: 'company',
    createdAt: false,
    updatedAt: false
})

class Company extends Model<Company> {
    @Column
    id?: number

    @Column({
        field: 'name'
    })
    name?: string

    @Column({
        field: 'address'
    })
    address?: string

    @Column({
        field: 'website'
    })
    website?: string

    @Column({
        field: 'person_id'
    })
    personId?: number
}

export default Company
