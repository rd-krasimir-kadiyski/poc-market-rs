import {ChildData} from "./child-data";

export interface ParentData {
  code: string;
  name: string;
  order: number;
  children: ChildData[];
  isSeparated?: boolean;
}
