import { IQuestion } from "./iquestion";
import { IUser } from "./iuser";

export interface IExam {
      id: number,
    title:string,
    description:string,
    duration:number,
    createdBy:string,
    Questions:IQuestion[],
    
}
