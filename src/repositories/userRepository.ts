import { DataSource, In, Repository } from 'typeorm'
import UserEntity from '../entities/user'

class UserRepository implements UserRepository {
    private repository: Repository<UserEntity>

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(UserEntity)
    }

    async getAll(): Promise<UserEntity[]> {
        return this.repository.find()
    }

    async getById(id: number): Promise<UserEntity | undefined> {
        const user = await this.repository.findOneBy({ id: id })
        return user || undefined
    }
    
    async getBy(ids: number[]): Promise<UserEntity[] | undefined> {
        const users = await this.repository.findBy({
            id: In(ids)
        })
        return users || undefined;
    }

    async getByEmail(email: string): Promise<UserEntity | undefined> {
        const user = await this.repository.findOneBy({ email });
        return user || undefined;
    }

    async create(user: Omit<UserEntity, 'id'>): Promise<UserEntity> {
        const newUser = this.repository.create(user);
        return this.repository.save(newUser);
    }

    async update(id: number, user: Partial<Omit<UserEntity, 'id'>>): Promise<UserEntity | undefined> {
        const userToUpdate = await this.getById(id)

        if (!userToUpdate) {
            return undefined
        }
        
        this.repository.merge(userToUpdate, user);

        return this.repository.save(userToUpdate);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result?.affected ? result.affected > 0 : false;
    }
}

export default UserRepository;