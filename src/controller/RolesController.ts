import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Roles } from "../entity/Roles"

export class RolesController {

    private rolesRepository = AppDataSource.getRepository(Roles)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.rolesRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const roles = await this.rolesRepository.findOne({
            where: { id }
        })

        if (!roles) {
            return "unregistered roles"
        }
        return roles
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { id, name, descrip } = request.body;
        const roles = Object.assign(new Roles(), {
            id,
            name,
            descrip
        })
        return this.rolesRepository.save(roles)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        let rolesToRemove = await this.rolesRepository.findOneBy({ id })
        if (!rolesToRemove) {
            return "this roles not exist"
        }
        await this.rolesRepository.remove(rolesToRemove)
        return "roles has been removed"
    }

}