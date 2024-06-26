import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { GenericResponse } from "../vo/GenericResponse";
import { UsuariosVO } from "../vo/UsuariosVO";
import { Usuarios } from "../entity/Usuarios";

export class AuthController {

    private repository = AppDataSource.getRepository(Usuarios);

    constructor() { }

    async login(req: Request, res: Response, next: NextFunction): Promise<GenericResponse> {
        // console.log('method login');
        let resp: GenericResponse = new GenericResponse();
        const { ctaUserName, ctaPassWord } = req.body;
        if (!(ctaUserName && ctaPassWord)) {
            //console.log(JSON.stringify(e));
            resp.code = '-2';
            resp.message = ' Nombre de Usuario y contraseña son requeridos!';
            resp.data = null;
            return resp;
        }

        let user: Usuarios;
        try {
            user = await this.repository.findOneOrFail({ where: { ctaUserName: ctaUserName, ctaPassWord: ctaPassWord } });
            resp.data = user;
            resp.data = this.convertToVO(user);
        } catch (e) {
            //console.log(JSON.stringify(e));
            resp.code = '-1';
            resp.message = ' Nombre de Usuario o contraseña son incorrectos!';
            resp.data = null;
            return resp;
        }

        // Check password
        /*
        if (!user.checkPassword(ctaPassWord)) {
            return res.status(400).json({ message: 'Username or Password are incorrect!' });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

        res.json({ message: 'OK', token, userId: user.id, role: user.role });
        */
        //res.send(user);
        return resp;
    }

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<GenericResponse> {
        // console.log('method changePassword');
        let resp: GenericResponse = new GenericResponse();
        const { userId } = res.locals.jwtPayload;
        const { oldPassword, newPassword } = req.body;

        if (!(oldPassword && newPassword)) {
            resp.code = '-2';
            resp.data = new Usuarios();
            console.log('Atigua contraseña & nueva contraseña Son requeridas');
            return resp;
        }

        let user: Usuarios;
        try {
            user = await this.repository.findOneOrFail({ where: { id: userId, ctaPassWord: oldPassword } });
            resp.data = 1;
        } catch (e) {
            res.status(400).json({ message: 'Somenthing goes wrong!' });
            resp.code = '-1';
            resp.data = new Usuarios();
            console.log('Algo salio mal');
            return resp;
        }
        /*
        if (!user.checkPassword(oldPassword)) {
            return res.status(401).json({ message: 'Check your old Password' });
        }
        */
        return resp;
    }

    private convertToVO(inputUser: Usuarios): UsuariosVO {
        let itemUser: UsuariosVO = new UsuariosVO();
        itemUser = new UsuariosVO();
        itemUser.id = inputUser.id;
        itemUser.ctaUserName = inputUser.ctaUserName;
        itemUser.ctaEmail = inputUser.ctaEmail;
        itemUser.estado = inputUser.estado;
        return itemUser;
    }

}
export default AuthController;