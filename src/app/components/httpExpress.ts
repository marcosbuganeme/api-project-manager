import { Request, Response } from "express";

interface IRequest extends Request {}

interface IResponse extends Response {}

interface IReturn {
    erro?: string
    status: number
    mensagem?: string
    resultado?: []
}

export { IRequest, IResponse, IReturn }