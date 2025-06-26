export interface IResponse<D = {}> {
    code: number;
    data: D;
    message: string;
}