
import { Model, Table, Column, DataType } from 'sequelize-typescript'

@Table({
    tableName: 'person',
    createdAt: false,
    updatedAt: false
})

class Person extends Model<Person> {
    @Column
    id?: number

    @Column({
        field: 'first_name'
    })
    firstName?: string

    @Column({
        field: 'last_name'
    })
    lastName?: string

    @Column({
        field: 'gender'
    })
    gender?: string

    @Column({
        field: 'date_of_birth',
        type: DataType.DATE
      })
      dateOfBirth?: Date

    @Column({
        field: 'company_id'
    })
    companyId?: number
}

export default Person
